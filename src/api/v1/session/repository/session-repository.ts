import database from "@/infra/database/database";
import { NotFoundError, UnauthorizedError, ValidationError } from "../../core/errors/errors";
import { generateToken, generateVerificationCode } from "../utils/session-utils";
import { Session } from "../entity/session";

const EXPIRATION_SESSION_MILLISECONDS = 60 * 60 * 24 * 30 * 1000;
const EXPIRATION_CODE_MILLISECONDS = 5 * 60 * 1000; // 5 minutos

export async function insertPendingSession(userId: string): Promise<Session> {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + EXPIRATION_SESSION_MILLISECONDS);
  const code = generateVerificationCode();
  const codeExpiresAt = new Date(Date.now() + EXPIRATION_CODE_MILLISECONDS);
  const newSession = await runInsertQuery(token, userId, expiresAt, code, codeExpiresAt);
  return newSession;

  async function runInsertQuery(token: string, userId: string, expiresAt: Date, code: string, codeExpiresAt: Date) {
    const results = await database.query({
      text: `
      INSERT INTO
        sessions (token, user_id, expires_at, code, code_expires_at)
      VALUES
        ($1, $2, $3, $4, $5)
      RETURNING
        *
      ;`,
      values: [token, userId, expiresAt, code, codeExpiresAt],
    });
    return results.rows[0];
  }
}

export async function verifyCode(sessionId: string, inputCode: string): Promise<Session> {
  const session = await findSessionById(sessionId);

  if (session.status === "expired") {
    throw new UnauthorizedError({
      message: "Sessão expirada.",
      action: "Solicite um novo código de verificação.",
    });
  }

  const isValidCode = session.code.toString() === inputCode && new Date(session.code_expires_at) > new Date();

  if (!isValidCode) {
    const newAttempts = await increaseVerificationAttempts(sessionId);

    if (newAttempts >= 3) {
      await expireSession(sessionId);
      throw new UnauthorizedError({
        message: "Máximo de tentativas atingido. Inicie uma nova sessão.",
        action: "Solicite um novo código de verificação.",
      });
    }

    throw new UnauthorizedError({
      message: "Código inválido!",
      action: "Verifique o código no seu e-mail e tente novamente.",
    });
  }

  await activateSession(sessionId);
  return session;
}

export async function findSessionById(sessionId: string): Promise<Session> {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!uuidRegex.test(sessionId)) {
    throw new ValidationError({
      message: "O ID informado está no formato incorreto.",
      action: "Verifique se o ID da sessão está correto ou tente criar uma nova sessão.",
    });
  }

  const results = await database.query({
    text: `
      SELECT
        *
      FROM
        sessions
      WHERE
        id = $1
      `,
    values: [sessionId],
  });

  if (results.rowCount === 0) {
    throw new NotFoundError({
      message: "Sessão não encontrada.",
      action: "Verifique se o ID da sessão está correto ou tente criar uma nova sessão.",
    });
  }

  return results.rows[0];
}

export async function activateSession(sessionId: string) {
  await database.query({
    text: `
      UPDATE
        sessions
      SET
        status = 'active'
      WHERE
        id = $1
      `,
    values: [sessionId],
  });
}

export async function increaseVerificationAttempts(sessionId: string): Promise<number> {
  const results = await database.query({
    text: `
      UPDATE
        sessions
      SET
        attempts = attempts + 1
      WHERE
        id = $1
      RETURNING
        attempts
    `,
    values: [sessionId],
  });

  return results.rows[0].attempts;
}

export async function expireSession(sessionId: string) {
  await database.query({
    text: `
      UPDATE
        sessions
      SET
        status = 'expired'
      WHERE
        id = $1
      `,
    values: [sessionId],
  });
}
