import { Router } from "express";
import { getUserByUsername, createUser, updateUser } from "./rest/user-controller.js";

const router = Router();

router.post("/", createUser);
router.get("/:username", getUserByUsername);
router.patch("/:username", updateUser);

export { router as usersRoutes };
