import { Router } from "express";
import { getSummary, getTags } from "../controllers/ollamaC.js";

const router = Router();

router.post("/tags", getTags);
router.post("/summary", getSummary);

export default router;
