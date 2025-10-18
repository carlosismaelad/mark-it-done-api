import { version as uuidVersion } from "uuid";
import setCookieParser from "set-cookie-parser";
import {
  clearDatabase,
  createUserOrchestrator,
  runMigrationsBeforeTests,
  waitForAllServices,
} from "../../../../orchestrator";

interface SessionResponse {
  sessionId: string;
  message: string;
}

interface ErrorResponse {
  name: string;
  message: string;
  action: string;
  status_code: number;
}

beforeAll(async () => {
  await waitForAllServices();
  await clearDatabase();
  await runMigrationsBeforeTests();
});

describe("POST /api/v1/sessions", () => {
  describe("Anonymous user", () => {
    test("With incorrect `email` but correct `password`", async () => {
      await createUserOrchestrator({
        password: "correct-password",
      });

      const response = await fetch("http://localhost:8080/api/v1/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "incorrect.email@email.com",
          password: "correct-password",
        }),
      });

      expect(response.status).toBe(401);

      const responseBody = (await response.json()) as ErrorResponse;

      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Dados de autenticação não conferem.",
        action: "Verifique se os dados enviados estão corretos.",
        status_code: 401,
      });
    });

    test("With correct `email` but incorrect `password`", async () => {
      await createUserOrchestrator({
        email: "correct.email@email.com",
      });

      const response = await fetch("http://localhost:8080/api/v1/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "correct.email@email.com",
          password: "invalid-password",
        }),
      });

      expect(response.status).toBe(401);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Senha ou e-mail incorreto!",
        action: "Verifique se os dados enviados estão corretos.",
        status_code: 401,
      });
    });

    test("With incorrect `email` and incorrect `password`", async () => {
      await createUserOrchestrator();

      const response = await fetch("http://localhost:8080/api/v1/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "incorrect.email@email.com",
          password: "invalid-password",
        }),
      });

      expect(response.status).toBe(401);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Dados de autenticação não conferem.",
        action: "Verifique se os dados enviados estão corretos.",
        status_code: 401,
      });
    });

    test("With correct `email` and correct `password`", async () => {
      const createdUser = await createUserOrchestrator({
        email: "correct.email@mail.com",
        password: "correct-password",
      });

      const response = await fetch("http://localhost:8080/api/v1/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "correct.email@mail.com",
          password: "correct-password",
        }),
      });

      expect(response.status).toBe(201);

      const responseBody = (await response.json()) as SessionResponse;

      // O endpoint POST /sessions retorna apenas sessionId e message
      expect(responseBody).toEqual({
        sessionId: responseBody.sessionId,
        message: "Código de verificação enviado para o seu e-mail!",
      });

      expect(uuidVersion(responseBody.sessionId)).toBe(4);
    });
  });
});
