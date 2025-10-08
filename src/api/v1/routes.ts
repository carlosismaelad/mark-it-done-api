import { FastifyInstance } from "fastify";
import { usersRoutes } from "./user/routes.js";
import { itemsRoutes } from "./item/routes.js";

export async function apiV1Routes(fastify: FastifyInstance) {
  // Registrar rotas de usuários em /api/v1/users
  await fastify.register(usersRoutes, { prefix: "/users" });

  // Registrar rotas de items em /api/v1/items
  await fastify.register(itemsRoutes, { prefix: "/items" });
}
