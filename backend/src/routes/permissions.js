import { Router } from "express";
const router = Router();
import { getAllPermissions } from "../controllers/permissionsC.js";

router.get("/", getAllPermissions);

export default router;
