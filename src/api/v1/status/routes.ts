import { Router } from "express";
import { getDatabaseStatus } from "./rest/status-controller.js";

const router = Router();

router.get("/", getDatabaseStatus);

export { router as statusRoutes };
