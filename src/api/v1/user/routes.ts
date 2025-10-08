import { FastifyInstance } from "fastify";
import {
  getUserByUsername,
  createUser,
  updateUser,
} from "./rest/controller.js";

export async function usersRoutes(fastify: FastifyInstance) {
  fastify.post("/", createUser);
  fastify.get("/:username", getUserByUsername);
  fastify.patch("/:username", updateUser);
}
