import { News } from "../models/newsM.js";
import { getSource } from "../utils/scraping/newsScraping.js";
import URLs from "../models/urlsM.js";
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
            await News.setTags([response[0].id, tags]);
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
 * Processes a batch of URLs from the request body, prepares them for insertion into the database,
 * and executes a batch insert operation.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} Sends an HTTP status code in the response after attempting to insert the URLs.
 */
const setURLsBatch = async (req, res) => {
    if (req.body.urls === "") {
        res.sendStatus(503);
        return;
    }
    const urls = req.body.urls.split("\n");
    let valuesPlaceholders = "";
    for (let i = 0; i < urls.length; i++) {
        urls[i] = [urls[i], req.body.user_id, req.body.category_id];
        valuesPlaceholders += `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`;
        if (i < urls.length - 1) {
            valuesPlaceholders += ", ";
        }
    }
    const values = urls.flat();
    const result = await URLs.setURLsBatch(valuesPlaceholders, values);
    if (result === 200 && !workerPool.processingURLs) {
        workerPool.run("processURLs");
    }
    res.sendStatus(result);
};

export { getNewsData, setNews, setURLsBatch };
