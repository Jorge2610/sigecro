import axios from "axios";
import * as cheerio from "cheerio";
import { sleep } from "../utils.js";

const delay = parseInt(Math.floor(parseInt(process.env.DELAY) / 2));

const monthsMap = new Map();
monthsMap.set("enero", "01");
monthsMap.set("febrero", "02");
monthsMap.set("marzo", "03");
monthsMap.set("abril", "04");
monthsMap.set("mayo", "05");
monthsMap.set("junio", "06");
monthsMap.set("julio", "07");
monthsMap.set("agosto", "08");
monthsMap.set("septiembre", "09");
monthsMap.set("octubre", "10");
monthsMap.set("noviembre", "11");
monthsMap.set("diciembre", "12");

/**
 * Extracts data from an opinion article.
 *
 * @param {cheerio.CheerioAPI} $ - The cheerio.CheerioAPI object representing the article's HTML.
 * @returns {Object} An object containing the extracted data, including title, date/time, and content.
 */
const getOpinionData = ($) => {
    const title = $("h2.title").text().trim();
    const dateTime = getDateTime($(".content-time").text().trim());
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
    text = text.split(" ");
    const day = text[0];
    const month = monthsMap.get(text[2]);
    const year = text[4];
    const hours =
        text[5].length === 6 ? text[5][1] + text[5][2] : "0" + text[5][1];
    const minutes =
        text[5].length === 6
            ? text[5][4] + text[5][5]
            : text[5][3] + text[5][4];
    return new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);
};

/**
 * Extracts the main content from a news article.
 *
 * @param {cheerio.CheerioAPI} $ - The cheerio.CheerioAPI object representing the article's HTML.
 * @returns {string[]} An array of strings containing the extracted content paragraphs.
 */
const getContent = ($) => {
    const content = [];
    $(".body p").each((i, element) => {
        const text = $(element).text().trim();
        content.push(text);
    });
    if (content[content.length - 1].includes("Visítanos en nuestro Canal de")) {
        content.pop();
        content.pop();
        content.pop();
    }
    return content;
};

const topicsMap = new Map();
topicsMap.set("Cochabamba", "Cochabamba");
topicsMap.set("Deportes", "Deportes");
topicsMap.set("Mundo", "Mundo");
topicsMap.set("Opinión", "Opinión");
topicsMap.set("País", "El País");
topicsMap.set("Policial", "Policiales");

/**
 * Retrieves URLs from the "Opinión" website based on the active topics.
 *
 * @param {Array<Object>} topics - Array of topic objects with `name` and `active` properties.
 * @returns {Promise<Array<string>>} Resolves to an array of URLs related to the active topics.
 */
const getOpinionUrls = async (topics) => {
    const activeTopics = getActiveTopics(topics);
    let urls = [];
    if (activeTopics.length > 0) {
        urls = await getUrls(activeTopics);
    }
    return urls;
};

/**
 * Filters and retrieves the active topics from the given list of topics.
 *
 * @param {Array<Object>} topics - Array of topic objects that contain `name` and `active` properties.
 * @returns {Array<string>} Array of active topic names mapped to the relevant section.
 */
const getActiveTopics = (topics) => {
    let activeTopics = [];
    for (const topic of topics) {
        if (topic.active) {
            activeTopics = [...activeTopics, topicsMap.get(topic.name)];
        }
    }
    return activeTopics;
};

/**
 * Fetches URLs by iterating through pages from the "Opinión" website for the provided active topics.
 *
 * @param {Array<string>} activeTopics - Array of active topic names used to filter the URLs.
 * @returns {Promise<Array<string>>} Resolves to an array of URLs fetched from the website.
 * @throws {Error} Throws an error if HTML parsing or URL fetching fails.
 */
const getUrls = async (activeTopics) => {
    let urls = [];
    let $ = cheerio.load("<div>Empty!</div>");
    let flag = true;
    let page = 1;
    const selector = getSelector(activeTopics);
    while (flag && page < 10) {
        let html = await getHtml(page);
        $ = cheerio.load(html);
        let tags = $("article");
        tags.length > 0 ? page++ : (flag = false);
        tags = tags.find(selector).parent().find("h2 > a");
        tags.each((_, element) => {
            const url = $(element).attr("href");
            urls = [...urls, `https://www.opinion.com.bo${url}`];
        });
        await sleep(delay);
    }
    return urls;
};

/**
 * Builds a CSS selector based on the active topics to filter relevant articles.
 *
 * @param {Array<string>} activeTopics - Array of active topic names.
 * @returns {string} The CSS selector string for filtering articles.
 */
const getSelector = (activeTopics) => {
    let selector = "";
    for (let i = 0; i < activeTopics.length; i++) {
        selector += `.pretitle:contains("${activeTopics[i]}")`;
        if (i !== activeTopics.length - 1) {
            selector += ", ";
        }
    }
    return selector;
};

/**
 * Fetches the HTML content of a page from the "Opinión" website based on the date and page number.
 *
 * @param {number} page - The page number to fetch.
 * @returns {Promise<string>} Resolves to the HTML content of the requested page.
 */
const getHtml = async (page) => {
    try {
        const params = getSearchParams();
        let url = `https://www.opinion.com.bo/archive/content/${params.year}/${params.month}%2F${params.day}`;
        if (page > 1) {
            url += `?page=${page}`;
        }
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("ERROR on opinion getHtml");
        return "<div></div>";
    }
};

/**
 * Retrieves the search parameters for fetching articles from the "Opinión" website.
 * It calculates the previous day's date for the search.
 *
 * @returns {Object} An object containing `day`, `month`, and `year` values for URL search.
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
    return { day, month, year };
};

export { getOpinionData, getOpinionUrls };
