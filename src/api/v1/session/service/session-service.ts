import { UnauthorizedError } from "@/api/v1/core/errors/errors";
import userRepository from "../../user/repository/user-repository";
import { SessionResponseDto } from "../rest/dto/session-response";
import { insertPendingSession, verifyCode, findSessionById } from "../repository/session-repository";
import { comparePasswords } from "../../security/password";

export async function createSessionWithAuth(userId: string): Promise<SessionResponseDto> {
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
      message: "Password não confere.",
      action: "Verifique se os dados enviados estão corretos.",
    });
  }
}

export async function verifySessionCode(sessionId: string, code: string): Promise<SessionResponseDto> {
  const verifiedSession = await verifyCode(sessionId, code);
  return verifiedSession;
}

export async function getSessionById(sessionId: string): Promise<SessionResponseDto> {
  const session = await findSessionById(sessionId);
  return session;
}
