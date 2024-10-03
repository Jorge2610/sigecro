import { News } from "../models/newsM.js";
import { getSource } from "../utils/scraping/newsScraping.js";
import workerPool from "../utils/workers/WorkerPool.js";
import axios from "axios";
import http from "http";
import https from "https";
import sharp from "sharp";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config();

const messages = JSON.parse(
    fs.readFileSync(path.join("./src/utils/JSON/messages.json"))
);

const httpAgent = new http.Agent({ keepAlive: false });
const httpsAgent = new https.Agent({ keepAlive: false });

const axiosInstance = axios.create({
    httpAgent,
    httpsAgent,
});

/**
 * Creates a new news article in the database.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @return {Promise<void>} A promise that resolves when the operation is completed.
 */
const setNews = async (req, res, next) => {
    try {
        const imageURL = await uploadImage(req);
        const data = [
            req.body.title,
            req.body.content,
            req.body.date,
            req.body.source,
            req.body.url,
            req.body.summary,
            imageURL,
            req.body.status,
            req.body.category_id,
            req.body.user_id,
        ];
        const response = await News.create(data);
        if (req.body.tags) {
            const tags = JSON.parse(req.body.tags);
            await News.setTags(response[0].id, tags);
        }
        res.status(201).json({
            message: messages["'messages"].new.post.success,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: messages["'messages"].new.post.error });
        next();
    }
};

/**
 * Uploads an image from an HTTP request to the file system.
 *
 * @param {Object} req - The HTTP request object containing the image file.
 * @return {string|null} The URL of the uploaded image or null if no image was provided.
 */
const uploadImage = async (req) => {
    if (req.file) {
        const dirPath = path.join("./public/images/news");
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        const imagePath = path.join(dirPath, `${req.body.title}.webp`);
        await sharp(req.file.buffer).webp({ quality: 75 }).toFile(imagePath);
        return `${process.env.API_URL}/images/news/${req.body.title}.webp`;
    }
    return null;
};

/**
 * Performs a basic search for news based on the provided search query.
 *
 * @param {Object} req - The HTTP request object containing the search query.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function in the stack.
 * @return {Promise<void>} A promise that resolves when the search operation is completed.
 */
const basicSearchNews = async (req, res, next) => {
    try {
        const response = await News.searchBasicNews(
            req.query.search,
            req.query.limit,
            req.query.page
        );
        res.status(200).json(response);
    } catch (error) {
        res.sendStatus(500);
    }
};

/**
 * Performs an advanced search for news based on the provided filters.
 *
 * @param {Object} req - The HTTP request object containing the filters.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function in the stack.
 * @return {Promise<void>} A promise that resolves when the search operation is completed.
 */
const advancedSearchNews = async (req, res, next) => {
    console.log(req.query.filters);
    try {
        const response = await News.searchAdvancedNews(
            req.query.filters,
            req.query.limit,
            req.query.page
        );
        res.status(200).json(response);
    } catch (error) {
        res.sendStatus(500);
    }
};

/**
 * Retrieves news data from a provided URL and returns it in JSON format.
 *
 * @param {Object} req - The HTTP request object containing the URL of the news article.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function in the stack.
 * @return {Promise<JSON>} A promise that resolves with the scraped news data in JSON format.
 */
const getNewsData = async (req, res, next) => {
    const source = getSource(req.body.url);
    try {
        const response = await axiosInstance
            .get(req.body.url)
            .then((res) => res.data);
        const data = await workerPool.run("urlScraping", source, response);
        data.source = source;
        data.url = req.body.url;
        res.json(data);
    } catch (error) {
        res.sendStatus(503);
    }
};

/**
 * Handles the HTTP request to retrieve news sources with their topics from the database.
 * Sends the list of news sources as a JSON response.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} Sends a JSON response with news sources or a 503 status code if an error occurs.
 */
const getNewsSources = async (req, res) => {
    try {
        const newsSources = await News.getSources();
        newsSources.map((source) => {
            source.topics = [];
        });
        const newsTopics = await News.getTopics();
        newsTopics.map((topic) => {
            let asigned = false;
            let i = 0;
            while (!asigned && i < newsSources.length) {
                if (topic.news_source_id === newsSources[i].id) {
                    newsSources[i].topics.push(topic);
                    asigned = true;
                }
                i++;
            }
        });
        res.json(newsSources);
    } catch (error) {
        res.sendStatus(503);
    }
};

/**
 * Handles the HTTP request to update the state of a news source and its associated topics.
 * Sends the appropriate HTTP status response based on the result of the updates.
 *
 * @param {Object} req - The Express request object, containing the source and topics data in `req.body.data`.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} Sends a status code based on the success or failure of the operation.
 */
const setNewsSourcesState = async (req, res) => {
    const values = [];
    req.body.data.topics.map((topic) => {
        values.push(parseInt(topic.id));
        values.push(topic.active);
    });
    const source = req.body.data.source;
    try {
        const result = await News.setSourceState(source.id, source.active);
        if (values.length > 0) {
            await News.setTopicsState(values);
        }
        workerPool.run("programmedRecord");
        res.sendStatus(result);
    } catch (error) {
        res.sendStatus(503);
    }
};

export {
    getNewsData,
    setNews,
    basicSearchNews,
    getNewsSources,
    setNewsSourcesState,
    advancedSearchNews,
};
