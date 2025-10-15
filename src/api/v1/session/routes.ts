import { FastifyInstance } from "fastify";
import { createPendingSession, verifyCodeSent } from "./rest/controller";

export async function sessionRoutes(fastify: FastifyInstance) {
  fastify.post("/", createPendingSession);
  fastify.post("/verify-code", verifyCodeSent);
}
