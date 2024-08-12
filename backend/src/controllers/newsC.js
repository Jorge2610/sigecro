import { News } from "../models/newsM.js";
import sharp from "sharp";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config();

const messages = JSON.parse(
  fs.readFileSync(path.join("./src/controllers/messages.json"))
);

/**
 * Creates a new news entry in the database.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function in the stack.
 * @return {Promise<void>} A promise that resolves when the operation is complete.
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
    await News.create(data);
    res.status(201).json({ message: messages["'messages"].new.post.success });
    next();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: messages["'messages"].new.post.error });
    next();
  }
};

/**
 * Uploads an image from the HTTP request to the server's file system.
 *
 * @param {Object} req - The HTTP request object containing the image file.
 * @return {string|null} The URL of the uploaded image, or null if no image was provided.
 */
const uploadImage = async (req) => {
  if (req.file) {
    const dirPath = path.join("./public/images/news");
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    const imagePath = path.join(dirPath, `${req.body.title}.webp`);
    await sharp(req.file.buffer).webp({ quality: 75 }).toFile(imagePath);
    return `${process.env.API_URL}/news/image/${req.body.title}.webp`;
  }
  return null;
};

export { setNews };
