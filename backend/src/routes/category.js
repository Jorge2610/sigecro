import { Router } from "express";
import {
    getAllCategories,
    getCategoriesUsed,
    addCategory,
} from "../controllers/categoryC.js";

const router = Router();

//GET /api/category
router.get("/", getAllCategories);
router.get("/filterCategories", getCategoriesUsed);

//POST /api/category
router.post("/", addCategory);

export default router;
