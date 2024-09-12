import { Router } from "express";
import { getSummary} from "../controllers/ollamaC.js";

const router = Router();

router.post("/tags", );
router.get("/summary", getSummary);

export default router;
