import database from "../../../../infra/database/database";
import { FastifyReply, FastifyRequest } from "fastify";
import { getStatus } from "../services/status-service";

export async function getDatabaseStatus(request: FastifyRequest, reply: FastifyReply) {
  const status = await getStatus();
  return reply.status(200).send(status);
}
