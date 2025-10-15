import { Request, Response } from "express";
import { serialize } from "cookie";
import { SessionRequest } from "./dto/sesion-request-dto";
import { createSessionWithAuth, getAuthenticatedUser, verifySessionCode } from "../service/session-service";
import { ConfirmSessionDto } from "./dto/confirm-session-dto";

export async function createPendingSession(req: Request, res: Response) {
  const userInputValues = req.body as SessionRequest;
  const authenticatedUser = await getAuthenticatedUser(userInputValues.email, userInputValues.password);
  const newSession = await createSessionWithAuth(authenticatedUser.id);

  res.status(201).json({
    sessionId: newSession.id,
    message: "Código de verificação enviado para o seu e-mail!",
  });
}

export async function verifyCodeSent(req: Request, res: Response) {
  const confirmSessionInput = req.body as ConfirmSessionDto;
  const verifiedSession = await verifySessionCode(confirmSessionInput.sessionId, confirmSessionInput.code);

  setSessionCookie(res, verifiedSession.token);

  res.status(200).json({
    message: "Verificação concluída com sucesso!",
  });
}

function setSessionCookie(res: Response, sessionToken: string) {
  const cookieString = serialize("md_session", sessionToken, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  });

  res.setHeader("Set-Cookie", cookieString);
}
