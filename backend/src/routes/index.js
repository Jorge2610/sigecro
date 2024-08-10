import { Router } from "express";
const router = Router();
import permissionsRoutes from "./permissions.js";

router.use("/permissions", permissionsRoutes);

export default router;
