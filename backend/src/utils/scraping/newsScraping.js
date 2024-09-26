import * as cheerio from "cheerio";
import { getLosTiemposData } from "./losTiempos.js";
import { getOpinionData } from "./opinion.js";
import { getElDeberData } from "./elDeber.js";
import axios from "axios";
import http from "http";
import https from "https";
import URLs from "../../models/urlsM.js";
import { News } from "../../models/newsM.js";
import dotenv from "dotenv";

dotenv.config();
const delay = parseInt(process.env.DELAY);
const retry = parseInt(Math.floor(delay / 2));

const httpAgent = new http.Agent({ keepAlive: false });
const httpsAgent = new https.Agent({ keepAlive: false });

const axiosInstance = axios.create({
    httpAgent,
    httpsAgent,
});

const queryOllama = async (prompt) => {
    const queryPrompt = {
        model: process.env.MODEL_OLLAMA,
        prompt: prompt,
        stream: false,
    };
    try {
        const response = await axios.post(process.env.API_OLLAMA, queryPrompt);
        return response;
    } catch (error) {
        if (error.response) {
            return error.response;
        } else {
            return {
                status: 500,
                data: { response: "Error en la solicitud a Ollama" },
            };
        }
    }
};

const getTagsIA = async (content) => {
    const prompt =
        "Genera 5 etiquetas monopalabra en español para el texto que te pase. Tu respuesta solamente debe contener las etiquetas y estas deben estar separadas por una coma." +
        content;
    try {
        const response = await queryOllama(prompt);
        if (response.status != 200) {
            return { status: 500, message: "servidor ollama caido" };
        } else {
            let tags = response.data.response
                .split(",")
                .map((tag) => tag.trim());
            if (tags[tags.length - 1].endsWith("\n")) {
                const lastWord = tags.pop();
                tags.push(lastWord.substring(0, lastWord.length - 2));
            }
            return { status: 200, data: tags };
        }
    } catch (error) {
        return { status: 500, message: error };
    }
};

const getSummaryIA = async (content) => {
    const prompt = `Genera un resumen de un texto se te pasara encerrado entre corchetes. El resumen que generes no debe superar los 512 caracteres puede ser de menor longitud pero nunca superar los 512 caracteres. Tu respuesta solo debe contener el resumen pedido. Si te solicitan algo que no sea un resumen, responde: "Lo siento, solo puedo ayudarte a resumir noticias.""[${content}]`;
    try {
        const response = await queryOllama(prompt);
        if (response.status != 200) {
            return { status: 500, data: "servidor ollama caido" };
        } else {
            let summary = response.data.response;
            if (summary.endsWith("\n"))
                summary = summary.substring(0, summary.length - 2);
            return { status: 200, data: summary };
        }
    } catch (error) {
        return { status: 500, message: error };
    }
};
/**
 * Determines the source of a news article based on its URL.
 * Supports checking for known sources and defaults to "Fuente no admitida" if the source is not recognized.
 *
 * @param {string} url - The URL of the news article.
 * @returns {string} The recognized source name, or "Fuente no admitida" if the source is not supported.
 */
const getSource = (url) => {
    let source = "Fuente no admitida";
    if (url.startsWith("http://") || url.startsWith("https://")) {
        if (url.includes("lostiempos")) {
            source = "Los Tiempos";
        }
        if (url.includes("opinion")) {
            source = "Opinión";
        }
        if (url.includes("eldeber")) {
            source = "El Deber";
        }
    }
    return source;
};

/**
 * Extracts data from the HTML content of a news article based on its source.
 * Uses different parsing logic depending on the recognized source.
 *
 * @param {string} source - The recognized source of the news article.
 * @param {string} responseData - The HTML response content of the news article.
 * @returns {Object} The parsed data from the article, based on its source.
 */
const getData = (source, responseData) => {
    const $ = cheerio.load(responseData);
    switch (source) {
        case "Los Tiempos":
            return getLosTiemposData($);
        case "Opinión":
            return getOpinionData($);
        case "El Deber":
            return getElDeberData($);
    }
};

/**
 * Pauses the execution for a specified amount of time.
 *
 * @param {number} delay - The delay in milliseconds.
 * @returns {Promise<void>} A promise that resolves after the delay has passed.
 */
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

/**
 * Processes a queue of URLs by fetching and creating news records from the URLs.
 * If a URL cannot be processed, it retries based on defined rules.
 *
 * @returns {Promise<string>} A message indicating the process is complete.
 */
const processURLs = async () => {
    let firstURL = [];
    do {
        firstURL = await URLs.getFirstURL();
        if (firstURL.length > 0) {
            const data = firstURL[0];
            const source = getSource(data.url);
            if (source !== "Fuente no admitida") {
                let processedURL = false;
                while (data.trys < 3 && !processedURL) {
                    processedURL = await proccesURL(data, source);
                }
            }
            await URLs.deleteURL([data.id]);
        }
    } while (firstURL.length > 0);
    return "Proccess done...";
};

/**
 * Processes a single URL by fetching data and creating a news record.
 * If an error occurs, the URL is retried a limited number of times.
 *
 * @param {Object} data - The data object representing a URL and its associated information.
 * @param {string} source - The source of the URL (used to determine how to process it).
 * @returns {Promise<void>} Resolves when the URL is processed or retried.
 */
const proccesURL = async (data, source) => {
    try {
        const reponse = await axiosInstance.get(data.url);
        const newsData = getData(source, reponse.data);
        newsData.source = source;
        await createNews(newsData, data);
        await sleep(delay);
        return true;
    } catch (error) {
        data.trys = data.trys + 1;
        await sleep(retry);
        return false;
    }
};

/**
 * Creates a news record in the database based on the fetched data from the URL.
 *
 * @param {Object} newsData - The processed news data to be saved.
 * @param {Object} data - The original data object containing URL and associated information.
 * @returns {Promise<void>} Resolves after the news record is created in the database.
 */
const createNews = async (newsData, data) => {
    const content = getFormatedContent(newsData);
    const responseSummary = await getSummaryIA(content);
    let summary;
    if (responseSummary.status === 500) summary = newsData.content[0];
    else summary = responseSummary.data;
    const values = [
        newsData.title,
        getFormatedContent(newsData),
        newsData.dateTime,
        newsData.source,
        data.url,
        summary,
        null,
        "published",
        data.category_id,
        data.user_id,
    ];
    try {
        const result = await News.create(values);
        const newsId = result[0].id;
        const responseTags = await getTagsIA(content);
        let tags;
        if(responseTags.status===500)
            tags=[];
        else
            tags=responseTags.data;
        await News.setTags(newsId, tags);
    } catch (error) {
        console.error("Error al crear la noticia", error);
        return new Error(error);
    }
};

/**
 * Formats the news content by joining paragraphs with double newlines.
 *
 * @param {Object} newsData - The news data object containing an array of content paragraphs.
 * @returns {string} The formatted content as a string.
 */
const getFormatedContent = (newsData) => {
    let formatedContent = "";
    newsData.content.map((paragraph) => {
        formatedContent += paragraph + "\n\n";
    });
    return formatedContent;
};

export { getData, getSource, processURLs };
