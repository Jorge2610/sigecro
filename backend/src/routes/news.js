import { Router } from "express";
import {
    createNews,
    getNewsSources,
    basicSearchNews,
    advancedSearchNews,
    getAllNewsSources,
    getMostUsedTags,
    getNewsById,
} from "../controllers/newsC.js";
import { upload } from "../middlewares/multer.js";
import scrapingRoutes from "./scraping.js";

const router = Router();

//GET /api/news
router.get("/sources", getNewsSources);
router.get("/search", basicSearchNews);
router.get("/advancedSearch", advancedSearchNews);
router.get("/all_sources", getAllNewsSources);
router.get("/tags", getMostUsedTags);
router.get("/:id", getNewsById);

//POST /api/news
router.post("/", upload.single("image"), createNews);

// Otras rutas
router.use("/scraping", scrapingRoutes);

export default router;
