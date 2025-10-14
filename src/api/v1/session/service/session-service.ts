import { UnauthorizedError } from "@/infra/errors/errors";
import userRepository from "../../user/repository/user-repository";
import { SessionResponseDto } from "../rest/dto/session-response";
import { insertNewSession } from "../repository/session-repository";
import { comparePasswords } from "../../security/password";

export async function getAuthenticatedUser(providedEmail: string, providedPassword: string) {
  try {
    const storedUser = await userRepository.findByEmail(providedEmail);
    await validatePassword(providedPassword, storedUser.password);
    return storedUser;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw new UnauthorizedError({
        message: "Dados de autenticação não conferem.",
        action: "Verifique se os dados enviados estão corretos.",
      });
    }
    throw error;
  }
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

export async function createSession(userId: string): Promise<SessionResponseDto> {
  const newSession = await insertNewSession(userId);
  return newSession;
}
