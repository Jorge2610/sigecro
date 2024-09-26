import { Router } from "express";
import { setNews, getNewsData, getNewsSources } from "../controllers/newsC.js";
import { upload } from "../middlewares/multer.js";
import {
    setURLsBatch,
    getURLsBatch,
    deleteURLs,
} from "../controllers/urlsC.js";

const router = Router();

//GET /api/news
router.get("/sources", getNewsSources);
router.get("/scraping/batch", getURLsBatch);

//POST /api/news
router.post("/", upload.single("image"), setNews);
router.post("/scraping", getNewsData);
router.post("/scraping/batch", setURLsBatch);

//DELETE /api/news
router.delete("/scraping/batch", deleteURLs);

export default router;
