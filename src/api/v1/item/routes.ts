import { FastifyInstance } from "fastify";
import {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} from "./rest/item-controller.js";

export async function itemsRoutes(fastify: FastifyInstance) {
  fastify.get("/", getAllItems);
  fastify.post("/", createItem);
  fastify.get("/:id", getItemById);
  fastify.patch("/:id", updateItem);
  fastify.delete("/:id", deleteItem);
}
