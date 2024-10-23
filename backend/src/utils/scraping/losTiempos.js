import axios from "axios";
import * as cheerio from "cheerio";
import { sleep } from "../utils.js";

const delay = parseInt(Math.floor(parseInt(process.env.DELAY) / 2));

/**
 * Extracts data from a Los Tiempos news article.
 *
 * @param {cheerio.Cheerio} $ - The cheerio.Cheerio object representing the article's HTML.
 * @returns {Object} An object containing the extracted data, including title, date/time, and content.
 */
const getLosTiemposData = ($) => {
    const title = $("h1").text().trim();
    const dateTime = getDateTime($(".date-publish").text().trim());
    const content = getContent($);
    return { title: title, dateTime: dateTime, content: content };
};

/**
 * Extracts date and time from a text string in a specific format.
 *
 * @param {string} text - The text string containing the date and time information.
 * @returns {Date} A Date object representing the extracted date and time.
 */
const getDateTime = (text) => {
    const day = text[13] + text[14];
    const month = text[16] + text[17];
    const year = text[19] + text[20] + text[21] + text[22];
    const hours = text.length === 35 ? text[30] + text[31] : "0" + text[30];
    const minutes =
        text.length === 35 ? text[33] + text[34] : text[32] + text[33];
    return new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);
};

/**
 * Extracts the main content from a news article.
 *
 * @param {cheerio.Cheerio} $ - The cheerio.Cheerio object representing the article's HTML.
 * @returns {string[]} An array of strings containing the extracted content paragraphs.
 */
const getContent = ($) => {
    let content = [];
    $(".field-items p").each((i, element) => {
        const text = $(element).text().trim();
        if (!text.includes("Te podría interesar")) {
            content.push(text);
        }
    });
    if (content.length === 1) {
        content = content[0].split("\n");
    }
    return content;
};

const topicsMap = new Map();
topicsMap.set("Mundo", "5");
topicsMap.set("País", "3");
topicsMap.set("Economía", "26149");
topicsMap.set("Cochabamba", "2");
topicsMap.set("Seguridad", "32978");
topicsMap.set("Deportes", "8");
let topicName = "";

/**
 * Retrieves URLs from the "Los Tiempos" website based on active topics.
 *
 * @param {Array<Object>} topics - Array of topic objects that contain `name` and `active` properties.
 * @returns {Promise<Array<string>>} Resolves to an array of URLs related to the active topics.
 */
const getLosTiemposUrls = async (topics) => {
    const urls = [];
    for (const topic of topics) {
        topicName = topic.name;
        if (topic.active) {
            await getUrls(urls);
        }
    }
    return urls;
};

/**
 * Fetches and appends URLs to the provided array by iterating through pages from the "Los Tiempos" website.
 * Stops fetching when there are no more links on a page.
 *
 * @param {Array<string>} urls - Array that stores the fetched URLs.
 * @returns {Promise<void>} Resolves when the URL fetching process completes.
 */
const getUrls = async (urls) => {
    let $ = cheerio.load("<div>Empty!</div>");
    let flag = true;
    let page = 0;
    while (flag && page < 10) {
        let html = await getHtml(page);
        $ = cheerio.load(html);
        $(".panels-flexible-region-inside-last").remove();
        const tags = $(".views-field-title a");
        tags.each((i, element) => {
            const url = $(element).attr("href");
            urls.push(`https://www.lostiempos.com${url}`);
        });
        tags.length > 0 ? page++ : (flag = false);
        await sleep(delay);
    }
};

/**
 * Fetches the HTML content of a page from "Los Tiempos" based on the search parameters and page number.
 *
 * @param {number} page - The page number to fetch.
 * @returns {Promise<string>} Resolves to the HTML content of the requested page.
 */
const getHtml = async (page) => {
    try {
        const params = getSearchParams();
        let url = `https://www.lostiempos.com/hemeroteca-fecha?fecha=${params.month}%2F${params.day}%2F${params.year}&seccion=${params.section}`;
        if (page > 0) {
            url += `&page=${page}`;
        }
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("ERROR ON losTiempos.getHtml");
        return "<div></div>";
    }
};

/**
 * Retrieves search parameters for the "Los Tiempos" website based on the previous day's date.
 *
 * @returns {Object} An object containing `day`, `month`, `year`, and `section` for the URL search.
 */
const getSearchParams = () => {
    const yesterday = new Date(Date.now() - 86400000);
    const day =
        yesterday.getDate() > 9
            ? yesterday.getDate()
            : "0" + yesterday.getDate();
    const month =
        yesterday.getMonth() + 1 > 9
            ? yesterday.getMonth() + 1
            : "0" + (yesterday.getMonth() + 1);
    const year = yesterday.getFullYear();
    const section = topicsMap.get(topicName);
    return { day, month, year, section };
};

export { getLosTiemposData, getLosTiemposUrls };
