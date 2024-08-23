import { News } from "../models/newsM.js";
import { newsScraping } from "../utils/scraping/newsScraping.js";
import sharp from "sharp";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config();

const messages = JSON.parse(
  fs.readFileSync(path.join("./src/utils/JSON/messages.json"))
);

/**
 * Crea una nueva noticia en la base de datos.
 *
 * @param{Object} req - El objeto de solicitud HTTP.
 * @param{Object} res - El objeto de respuesta HTTP.
 * @param{Function} next - La función de middleware siguiente.
 * @return{Promise<void>} Una promesa que resuelve cuando la operación es completada.
 */
const setNews = async (req, res, next) => {
  try {
    const imageURL = uploadImage(req);
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
    const tags = JSON.parse(req.body.tags);
    tags && (await News.setTags([response[0].id, tags]));
    res.status(201).json({ message: messages["'messages"].new.post.success });
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

const getNewsData = async (req, res, next) => {
  const newsData = await newsScraping(req.body.url);
  res.json(newsData);
};

export { getNewsData, setNews };
