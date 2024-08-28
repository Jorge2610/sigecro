import { Router } from "express";
import { getAllCategories, addCategory} from "../controllers/categoryC.js";

const router = Router();

router.get("/", getAllCategories);
router.post("/", addCategory);

export default router;
