import { FastifyInstance } from "fastify";
import { createSession } from "./rest/controller";

export async function sessionRoutes(fastify: FastifyInstance) {
  fastify.post("/", createSession);
}
