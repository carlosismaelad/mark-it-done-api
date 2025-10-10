import { FastifyInstance } from "fastify";
import { getPendingMigrations, runMigrations } from "./rest/migrations-controller";

export async function migrationsRoutes(fastify: FastifyInstance) {
  fastify.get("/", getPendingMigrations);
  fastify.post("/", runMigrations);
}
