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
 * Crea una nueva noticia en la base de datos.
 *
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 * @param {Function} next - La función de middleware siguiente.
 * @return {Promise<void>} Una promesa que resuelve cuando la operación es completada.
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
 * Sube una imagen al sistema de archivos desde una solicitud HTTP.
 *
 * @param {Object} req - El objeto de solicitud HTTP.
 * @return {string|null} La ruta de la imagen subida o null si no se proporcionó una imagen.
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
 * Obtiene la informacion de una noticia a partir de su URL.
 *
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 * @param {Function} next - La función de middleware siguiente.
 * @return {Promise<JSON>} Una promesa que resuelve cuando la operación es completada.
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

export { getNewsData, setNews, getNewsSources };
