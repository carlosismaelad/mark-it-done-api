import { FastifyReply, FastifyRequest } from "fastify";
import { listPendingMigrations, runPendingMigrations } from "../service/migrations-service";

export async function getPendingMigrations(request: FastifyRequest, reply: FastifyReply) {
  const pendingMigrations = await listPendingMigrations();
  return reply.status(200).send(pendingMigrations);
}

export async function runMigrations(request: FastifyRequest, reply: FastifyReply) {
  const migratedMigration = await runPendingMigrations();

  if (migratedMigration.length > 0) {
    return reply.status(201).send(migratedMigration);
  }
}
