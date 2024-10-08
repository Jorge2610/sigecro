import * as cheerio from "cheerio";
import { getLosTiemposData, getLosTiemposUrls } from "./losTiempos.js";
import { getOpinionData, getOpinionUrls } from "./opinion.js";
import { getElDeberData } from "./elDeber.js";
import URLs from "../../models/urlsM.js";
import { News } from "../../models/newsM.js";
import { sleep } from "../utils.js";
import axiosInstance from "../../config/axiosInstance.js";
import { Ollama } from "../../models/ollamaM.js";

const delay = parseInt(process.env.DELAY);
const retry = parseInt(Math.floor(delay / 2));

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
 * Processes a queue of URLs by fetching and creating news records from the URLs.
 * If a URL cannot be processed, it retries based on defined rules.
 *
 * @returns {Promise<string>} A message indicating the process is complete.
 */
const processURLs = async () => {
    let firstURL = [];
    do {
        try {
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
        } catch (error) {
            console.error("ERROR ON newsScraping.processURLs");
            firstURL = [];
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
 * @returns {Promise<boolean>} Resolves true when the URL is processed or false otherwise.
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
    try {
        const summary = await getIaSummary(content);
        const values = [
            newsData.title,
            getFormatedContent(newsData),
            newsData.dateTime,
            newsData.source,
            data.url,
            summary === "" ? newsData.content[0] : summary,
            null,
            "published",
            data.category_id,
            data.user_id,
        ];
        const result = await News.create(values);
        const tags = await getIaTags(content);
        if (tags.length > 0) {
            const newsId = result[0].id;
            await News.setTags(newsId, tags);
        }
    } catch (error) {
        console.error("ERROR ON newsScraping.createNews:\n", error);
        throw new Error(error);
    }
};

/**
 * Generates a summary using an AI model.
 *
 * @async
 * @param {string} content - The content to summarize.
 * @returns {Promise<string>} A Promise that resolves to the generated summary or an empty string if an error occurs.
 */
const getIaSummary = async (content) => {
    let summary;
    try {
        summary = await Ollama.generateSummary(content);
    } catch (error) {
        console.error("ERROR ON newsScraping.getIaSummary");
        summary = "";
    }
    return summary;
};

/**
 * Generates tags for a given content using an AI model.
 *
 * @async
 * @param {string} content - The content for which to generate tags.
 * @returns {Promise<string[]>} A Promise that resolves to an array of tags or an empty array if an error occurs.
 */
const getIaTags = async (content) => {
    let tags;
    try {
        tags = await Ollama.generateTags(content);
    } catch (error) {
        console.error("ERROR ON newsScraping.getIaTags");
        tags = [];
    }
    return tags;
};

/**
 * Formats the news content by joining paragraphs with double newlines.
 *
 * @param {Object} newsData - The news data object containing an array of content paragraphs.
 * @returns {string} The formatted content as a string.
 */
const getFormatedContent = (newsData) => {
    return newsData.content.join("\n\n");
};

/**
 * Retrieves URLs from multiple news sources and inserts them into the database.
 * Updates the last processing date of the sources.
 *
 * @returns {Promise<string>} Resolves with a success message once the process is completed.
 * @throws {Error} Throws an error if any database or URL-fetching operation fails.
 */
const getNewsUrls = async () => {
    console.log("getNewsUrls");
    const sources = await News.getSources();
    let urls = [];
    for (const source of sources) {
        const sourceUrls = await getSourceUrls(source);
        urls = [...urls, ...sourceUrls];
    }
    if (urls.length > 0) {
        try {
            await URLs.setURLsBatchDefault(urls);
            await News.setSourcesLastDate(sources);
        } catch (error) {
            console.error("ERROR ON newsScraping.getNewsUrls");
        }
    }
    return "Process done...";
};

/**
 * Retrieves URLs from a specific news source if it is active and its last processed date is valid.
 * Fetches the URLs based on the source name and topics associated with the source.
 *
 * @param {Object} source - The news source object containing its details (id, name, last_date, active).
 * @returns {Promise<Array<string>>} Resolves to an array of URLs fetched from the source.
 */
const getSourceUrls = async (source) => {
    let sourceUrls = [];
    if (source.active && checkLastDate(source)) {
        source.last_date = new Date();
        const topics = await News.getTopicsBySource(source.id);
        console.log("getSourceUrls, topics:", topics);
        switch (source.name) {
            case "Los Tiempos":
                sourceUrls = await getLosTiemposUrls(topics);
                break;
            case "Opinión":
                sourceUrls = await getOpinionUrls(topics);
                break;
            case "El Deber":
                sourceUrls = [];
                break;
        }
    }
    return sourceUrls;
};

/**
 * Checks whether the current date is later than the last date a news source was processed.
 *
 * @param {Object} source - The news source object with a `last_date` field.
 * @returns {boolean} Returns true if the current date is after the source's last processed date, false otherwise.
 */
const checkLastDate = (source) => {
    let currentDate = new Date();
    currentDate = currentDate.toLocaleString().split(",")[0].split("/");
    currentDate = new Date(
        `${currentDate[2]}-${currentDate[1]}-${currentDate[0]}`
    );
    let lastDate = new Date(source.last_date);
    return currentDate.getTime() > lastDate.getTime();
};

export { getData, getSource, processURLs, getNewsUrls };
