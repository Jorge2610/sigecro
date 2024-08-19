import { Router } from "express";
import { setNews, getNewsData } from "../controllers/newsC.js";
import { upload } from "../middlewares/multer.js";

const router = Router();

//POST /api/news
router.post("/", upload.single("image"), setNews);
router.post("/scraping", getNewsData);

export default router;
