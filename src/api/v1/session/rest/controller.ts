import { FastifyReply, FastifyRequest } from "fastify";
import { SessionRequest } from "./dto/sesion-request-dto";
import { createSession, getAuthenticatedUser } from "../service/session-service";

export async function create(request: FastifyRequest<{ Body: SessionRequest }>, reply: FastifyReply) {
  try {
    const userInputValues = request.body;

    const authenticatedUser = await getAuthenticatedUser(userInputValues.email, userInputValues.password);

    const newSession = await createSession(authenticatedUser.id);

    setSessionCookie(reply, newSession.token);

    return reply.status(201).send({
      message: "Sessão criada com sucesso",
    });
  } catch (error) {
    throw error;
  }
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
