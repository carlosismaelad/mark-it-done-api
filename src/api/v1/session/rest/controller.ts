import { FastifyReply, FastifyRequest } from "fastify";
import { SessionRequest } from "./dto/sesion-request-dto";
import { createSessionWithAuth, getAuthenticatedUser, verifySessionCode } from "../service/session-service";
import { ConfirmSessionDto } from "./dto/confirm-session-dto";

export async function createPendingSession(request: FastifyRequest<{ Body: SessionRequest }>, reply: FastifyReply) {
  const userInputValues = request.body;
  const authenticatedUser = await getAuthenticatedUser(userInputValues.email, userInputValues.password);
  const newSession = await createSessionWithAuth(authenticatedUser.id);

  return reply.status(201).send({
    sessionId: newSession.id,
    message: "Código de verificação enviado para o seu e-mail!",
  });
}

export async function verifyCodeSent(request: FastifyRequest<{ Body: ConfirmSessionDto }>, reply: FastifyReply) {
  const confirSessionInput = request.body;
  const verifiedSession = await verifySessionCode(confirSessionInput.sessionId, confirSessionInput.code);

  setSessionCookie(reply, verifiedSession.token);

  return reply.status(200).send({
    message: "Verificação concluída com sucesso!",
  });
}

function setSessionCookie(reply: FastifyReply, sessionToken: string) {
  reply.setCookie("md_session", sessionToken, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    signed: true,
  });
}
