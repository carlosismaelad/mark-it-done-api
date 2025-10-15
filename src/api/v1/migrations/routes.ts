import { Router } from "express";
import { getPendingMigrations, runMigrations } from "./rest/migrations-controller.js";

const router = Router();

router.get("/", getPendingMigrations);
router.post("/", runMigrations);

export { router as migrationsRoutes };
