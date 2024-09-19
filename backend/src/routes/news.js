import { Router } from "express";
import { setNews, getNewsData, setURLsBatch } from "../controllers/newsC.js";
import { upload } from "../middlewares/multer.js";

const router = Router();

//POST /api/news
router.post("/", upload.single("image"), setNews);
router.post("/scraping", getNewsData);
router.post("/scraping/batch", setURLsBatch);

export default router;
