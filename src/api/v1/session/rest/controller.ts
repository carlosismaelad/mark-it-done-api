import { FastifyReply, FastifyRequest } from "fastify";
import { SessionRequest } from "./dto/sesion-request-dto";
import { createSessionWithAuth, getAuthenticatedUser, verifySessionCode } from "../service/session-service";

export async function createPendingSession(request: FastifyRequest<{ Body: SessionRequest }>, reply: FastifyReply) {
  const userInputValues = request.body;
  const authenticatedUser = await getAuthenticatedUser(userInputValues.email, userInputValues.password);
  const newSession = await createSessionWithAuth(authenticatedUser.id);

  setSessionCookie(reply, newSession.token);

  return reply.status(201).send({
    message: "Sessão criada com sucesso",
  });
}

export async function verifyCodeSent(sessionId: string, code: string) {
  return await verifySessionCode(sessionId, code);
}

function setSessionCookie(reply: FastifyReply, sessionToken: string) {
  reply.setCookie("session_id", sessionToken, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    signed: true,
  });
}
