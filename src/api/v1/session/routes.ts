import { Router } from "express";
import { createPendingSession, verifyCodeSent } from "./rest/session-controller.js";

const router = Router();

router.post("/", createPendingSession);
router.post("/verify-code", verifyCodeSent);

export { router as sessionRoutes };
