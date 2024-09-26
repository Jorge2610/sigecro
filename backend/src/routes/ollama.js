import { Router } from "express";
import { getSummary, getTags } from "../controllers/ollamaC.js";

const router = Router();

router.get("/tags", getTags);
router.get("/summary", getSummary);

export default router;
