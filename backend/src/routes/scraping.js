import { Router } from "express";
import {
    setURLsBatch,
    getURLsBatch,
    deleteURLs,
} from "../controllers/urlsC.js";
import { getNewsData, setNewsSourcesState } from "../controllers/newsC.js";

const router = Router();

router.post("/", getNewsData);
router.post("/batch", setURLsBatch);
router.get("/batch", getURLsBatch);
router.delete("/batch", deleteURLs);
router.post("/programmed", setNewsSourcesState);

export default router;
