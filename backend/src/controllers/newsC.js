import { News } from "../models/newsM.js";
import { getSource } from "../utils/scraping/newsScraping.js";
import workerPool from "../utils/workers/workerPool.js";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import axiosInstance from "../config/axiosInstance.js";

/**
 * Creates a new news item in the database.
 *
 * @async
 * @param {Request} req - Express request object containing news data in req.body.
 * @param {Response} res - Express response object.
 */
const createNews = async (req, res) => {
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
        res.sendStatus(201);
    } catch (error) {
        console.error("ERROR ON news.createNews");
        res.sendStatus(500);
    }
};

/**
 * Uploads an image to the server.
 *
 * @async
 * @param {Request} req - Express request object containing the uploaded file.
 * @returns {string|null} Returns the URL of the uploaded image or null if no file was uploaded.
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
 * Performs a basic search for news items in the database.
 *
 * @async
 * @param {Request} req - Express request object containing search parameters in req.query.
 * @param {Response} res - Express response object.
 */
const basicSearchNews = async (req, res) => {
    const params = {
        search: req.query.search,
        limit: req.query.limit,
        page: req.query.page,
        sort_order: req.query.sort_order,
        categories: req.query.categories,
        start_date: req.query.start_date,
        end_date: req.query.end_date,
        sources: req.query.sources,
        filter_tags: req.query.filter_tags,
    };
    try {
        const response = await News.searchBasicNews(params);
        res.json(response);
    } catch (error) {
        console.error("ERROR ON news.basicSearchNews");
        res.sendStatus(500);
    }
};

/**
 * Performs an advanced search for news items in the database based on filters provided in the request query.
 *
 * @async
 * @param {Request} req - Express request object containing search filters in req.query.filters.
 * @param {Response} res - Express response object.
 */
const advancedSearchNews = async (req, res) => {
    const params = {
        filters: req.query.filters,
        limit: req.query.limit,
        page: req.query.page,
        sort_order: req.query.sort_order,
        categories: req.query.categories,
        start_date: req.query.start_date,
        end_date: req.query.end_date,
        sources: req.query.sources,
        filter_tags: req.query.filter_tags,
    };
    try {
        const response = await News.searchAdvancedNews(params);
        res.json(response);
    } catch (error) {
        console.error("ERROR ON news.advancedSearchNews");
        res.sendStatus(500);
    }
};

/**
 * Fetches and processes news data from a provided URL.
 *
 * @async
 * @param {Request} req - Express request object containing the URL in req.body.url.
 * @param {Response} res - Express response object.
 */
const getNewsData = async (req, res) => {
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
        console.error("ERROR ON news.getNewsData");
        res.sendStatus(503);
    }
};

/**
 * Retrieves a list of news sources and associates them with their respective topics.
 *
 * @async
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 */
const getNewsSources = async (req, res) => {
    try {
        const newsSources = await News.getSources();
        for (const source of newsSources) {
            source.topics = [];
        }
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
        console.error("ERROR ON news.getNewsSources");
        res.sendStatus(503);
    }
};

/**
 * Updates the state (active/inactive) of a news source and its associated topics.
 *
 * @async
 * @param {Request} req - Express request object containing source and topic data in req.body.data.
 * @param {Response} res - Express response object.
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
        console.error("ERROR ON news.setNewsSourcesState");
        res.sendStatus(503);
    }
};

/**
 * Handles the HTTP request to retrieve all news sources from the database.
 * Sends the list of news sources as a JSON response.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
const getAllNewsSources = async (req, res) => {
    try {
        const newsSources = await News.getAllSources();
        res.json(newsSources);
    } catch (error) {
        console.error("ERROR ON news.getAllNewsSources");
        res.sendStatus(503);
    }
};

/**
 * Retrieves the most used tags in the news database and sends them as a JSON response.
 *
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @returns {Promise<void>} Sends a JSON response with the most used tags.
 */
const getMostUsedTags = async (req, res) => {
    try {
        const tags = await News.getMostUsedTags();
        res.json(tags);
    } catch (error) {
        console.error("ERROR ON news.getMostUsedTags");
        res.sendStatus(503);
    }
};

/**
 * Retrieves a news item by its ID from the database.
 *
 * @async
 * @param {Request} req - Express request object containing the news item ID in req.params.id.
 * @param {Response} res - Express response object.
 */
const getNewsById = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await News.getById(id);
        res.json({ data });
    } catch (error) {
        console.error("ERROR ON news.getNewsById");
        res.sendStatus(503);
    }
};

export {
    getNewsData,
    createNews,
    basicSearchNews,
    getNewsSources,
    setNewsSourcesState,
    advancedSearchNews,
    getAllNewsSources,
    getMostUsedTags,
    getNewsById,
};
