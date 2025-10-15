import { Router } from "express";
import { getAllItems, getItemById, createItem, updateItem, deleteItem } from "./rest/item-controller.js";

const router = Router();

router.get("/", getAllItems);
router.post("/", createItem);
router.get("/:id", getItemById);
router.patch("/:id", updateItem);
router.delete("/:id", deleteItem);

export { router as itemsRoutes };
