import { Router } from "express";
import {
    setNews,
    getNewsData,
    getNewsSources,
    setNewsSourcesState,
    basicSearchNews,
    advancedSearchNews,
    getAllNewsSources,
    getMostUsedTags,
    getNewsById
} from "../controllers/newsC.js";
import { upload } from "../middlewares/multer.js";
import {
    setURLsBatch,
    getURLsBatch,
    deleteURLs
} from "../controllers/urlsC.js";

const router = Router();

//GET /api/news
router.get("/sources", getNewsSources);
router.get("/scraping/batch", getURLsBatch);
router.get("/search", basicSearchNews);
router.get("/advancedSearch", advancedSearchNews); 
router.get("/all_sources", getAllNewsSources);
router.get("/tags", getMostUsedTags);
router.get('/:id', getNewsById);

//POST /api/news
router.post("/", upload.single("image"), setNews);
router.post("/scraping", getNewsData);
router.post("/scraping/batch", setURLsBatch);
router.post("/scraping/programed", setNewsSourcesState);

//DELETE /api/news
router.delete("/scraping/batch", deleteURLs);

export default router;
