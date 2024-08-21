import { Router } from "express";
import { getAllCategories } from "../controllers/categoryC.js";

const router = Router();

router.get("/", getAllCategories);

export default router;
