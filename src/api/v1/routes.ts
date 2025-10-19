import { Router } from "express";
import { itemsRoutes } from "./item/routes";
import { usersRoutes } from "./user/routes/routes";
import { statusRoutes } from "./status/routes";
import { migrationsRoutes } from "./migrations/routes";
import { sessionRoutes } from "./session/routes";

const router = Router();

router.use("/status", statusRoutes);
router.use("/migrations", migrationsRoutes);
router.use("/users", usersRoutes);
router.use("/items", itemsRoutes);
router.use("/sessions", sessionRoutes);

export { router as apiV1Routes };
