import { UnauthorizedError } from "@/api/v1/core/errors/errors";
import userRepository from "../../user/repository/user-repository";
import { insertPendingSession, verifyCode } from "../repository/session-repository";
import { comparePasswords } from "../../security/password";
import { Session } from "../entity/session";

export async function createSessionWithAuth(userId: string): Promise<Session> {
  const newSession = await insertPendingSession(userId);
  return newSession;
}

export async function getAuthenticatedUser(providedEmail: string, providedPassword: string) {
  const storedUser = await userRepository.findByEmail(providedEmail);
  await validatePassword(providedPassword, storedUser.password);
  return storedUser;
}

export async function validatePassword(providedPassword: string, storedPassword: string) {
  const correctPasswordMatch = await comparePasswords(providedPassword, storedPassword);

  if (!correctPasswordMatch) {
    throw new UnauthorizedError({
      message: "Senha ou e-mail incorreto!",
      action: "Verifique se os dados enviados estão corretos.",
    });
  }
}

export async function verifySessionCode(sessionId: string, code: string): Promise<Session> {
  const verifiedSession = await verifyCode(sessionId, code);
  return verifiedSession;
}
