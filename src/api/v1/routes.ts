import { FastifyInstance } from "fastify";
import { usersRoutes } from "./user/routes.js";
import { itemsRoutes } from "./item/routes.js";
import { statusRoutes } from "./status/routes.js";

export async function apiV1Routes(fastify: FastifyInstance) {
  await fastify.register(statusRoutes, { prefix: "/status" });
  await fastify.register(usersRoutes, { prefix: "/users" });
  await fastify.register(itemsRoutes, { prefix: "/items" });
}
