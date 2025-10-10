import { FastifyInstance } from "fastify";
import { getDatabaseStatus } from "./rest/status-controller.js";

export async function statusRoutes(fastify: FastifyInstance) {
  fastify.get("/", getDatabaseStatus);
}
