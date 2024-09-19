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

const httpAgent = new http.Agent({ keepAlive: false });
const httpsAgent = new https.Agent({ keepAlive: false });

const axiosInstance = axios.create({
    httpAgent,
    httpsAgent,
});

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
    let urlsQueue = await URLs.getURLs();
    let processedURLsIds = [];
    while (urlsQueue.length > 0) {
        const data = urlsQueue.shift();
        const source = getSource(data.url);
        if (source === "Fuente no admitida" || data.trys > 2) {
            processedURLsIds.push(data.id);
            await sleep(process.env.RETRY_DELAY);
        } else {
            proccesURL(processedURLsIds, urlsQueue, data, source);
        }
        if (urlsQueue.length === 0) {
            const deletedURLs = await URLs.deleteURLs(processedURLsIds);
            if (deletedURLs) {
                urlsQueue = await URLs.getURLs();
            }
            processedURLsIds = [];
        }
    }
    return "Proccess done...";
};

/**
 * Processes a single URL by fetching data and creating a news record.
 * If an error occurs, the URL is retried a limited number of times.
 *
 * @param {number[]} processedURLsIds - An array of IDs of processed URLs.
 * @param {Object[]} urlsQueue - The queue of URLs to process.
 * @param {Object} data - The data object representing a URL and its associated information.
 * @param {string} source - The source of the URL (used to determine how to process it).
 * @returns {Promise<void>} Resolves when the URL is processed or retried.
 */
const proccesURL = async (processedURLsIds, urlsQueue, data, source) => {
    try {
        const reponse = await axiosInstance.get(data.url);
        const newsData = getData(source, reponse.data);
        newsData.source = source;
        await createNews(newsData, data);
        processedURLsIds.push(data.id);
        await sleep(process.env.DELAY);
    } catch (error) {
        data.trys = data.trys + 1;
        urlsQueue.push(data);
        await sleep(process.env.RETRY_DELAY);
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
    const values = [
        newsData.title,
        getFormatedContent(newsData),
        newsData.dateTime,
        newsData.source,
        data.url,
        newsData.content[0],
        null,
        "published",
        data.category_id,
        data.user_id,
    ];
    try {
        await News.create(values);
        //Insertar tags en la bd...
    } catch (error) {
        console.error("Error al crear la noticia", error);
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
