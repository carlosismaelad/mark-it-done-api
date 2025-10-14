import { FastifyInstance } from "fastify";
import { createPendingSession } from "./rest/controller";

export async function sessionRoutes(fastify: FastifyInstance) {
  fastify.post("/", createPendingSession);
}
