import { Router } from "express";
import { setNews } from "../controllers/newsC.js";
import { upload } from "../middlewares/multer.js";

const router = Router();

//POST /api/news
router.post("/", upload.single("image"), setNews);

export default router;
