import { FastifyInstance } from "fastify";
import { create } from "./rest/controller";

export async function sessionRoutes(fastify: FastifyInstance) {
  fastify.post("/", create);
}
