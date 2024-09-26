import { Router } from "express";
import permissionsRoutes from "./permissions.js";
import newsRoutes from "./news.js";
import categoryRoutes from "./category.js";
import ollamaRoutes from "./ollama.js";

const router = Router();

router.use("/permissions", permissionsRoutes);
router.use("/news", newsRoutes);
router.use("/categories", categoryRoutes);
router.use("/ollama", ollamaRoutes);

export default router;
