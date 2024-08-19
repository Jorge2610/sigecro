import { Router } from "express";
import permissionsRoutes from "./permissions.js";
import newsRoutes from "./news.js";

const router = Router();

router.use("/permissions", permissionsRoutes);
router.use("/news", newsRoutes);

export default router;
