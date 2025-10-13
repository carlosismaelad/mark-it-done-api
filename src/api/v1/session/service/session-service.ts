import { UnauthorizedError } from "@/infra/errors/errors";
import password from "../../security/password";
import userRepository from "../../user/repository/user-repository";
import { SessionResponseDto } from "../rest/dto/session-response";
import sessionRepository from "../repository/session-repository";

async function getAuthenticatedUser(providedEmail: string, providedPassword: string) {
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

async function validatePassword(providedPassword: string, storedPassword: string) {
  const correctPasswordMatch = await password.compare(providedPassword, storedPassword);

  if (!correctPasswordMatch) {
    throw new UnauthorizedError({
      message: "Password não confere.",
      action: "Verifique se os dados enviados estão corretos.",
    });
  }
}

async function createSession(userId: string): Promise<SessionResponseDto> {
  const newSession = await sessionRepository.create(userId);
  return newSession;
}

const sessionService = {
  getAuthenticatedUser,
  createSession,
};

export default sessionService;
