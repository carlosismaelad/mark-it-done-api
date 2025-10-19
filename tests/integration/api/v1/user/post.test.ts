import { CreatedUserResponseDto } from "../../../../../src/api/v1/user/rest/dtos/created-user-response-dto";
import {
  clearDatabase,
  createUserViaHttp,
  runMigrationsBeforeTests,
  waitForAllServices,
} from "../../../../orchestrator";

beforeAll(async () => {
  await waitForAllServices();
  await clearDatabase();
  await runMigrationsBeforeTests();
});

describe("POST /api/vi/users", () => {
  describe("Create user", () => {
    test("Create user with invalid e-mail", async () => {
      const response = await createUserViaHttp({ email: "invalid.email.com" });

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message:
          "Algo errado com o seu e-mail: deve ser um e-mail válido pois enviaremos o código de autenticação para ele.",
        action: "Ajuste os dados enviados e tente novamente.",
        status_code: 400,
      });
    });

    test("Create user with empty e-mail", async () => {
      const response = await createUserViaHttp({ email: " " });

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Campo 'e-mail' deve estar preenchido.",
        action: "Ajuste os dados enviados e tente novamente.",
        status_code: 400,
      });
    });

    test("Create user with empty username", async () => {
      const response = await createUserViaHttp({ username: " " });

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Campo 'Nome de usuário' deve estar preenchido.",
        action: "Ajuste os dados enviados e tente novamente.",
        status_code: 400,
      });
    });

    test("Create user with username greater than 30", async () => {
      const response = await createUserViaHttp({ username: "a".repeat(31) });

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Nome de usuário não pode conter mais de 30 caracteres.",
        action: "Ajuste os dados enviados e tente novamente.",
        status_code: 400,
      });
    });

    test("Create user with valid data", async () => {
      const response = await createUserViaHttp({ username: "validUsername", email: "valid.email@email.com" });

      expect(response.status).toBe(201);

      const responseBody = (await response.json()) as CreatedUserResponseDto;

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: responseBody.username,
      });
    });

    test("Create user with duplicated username", async () => {
      const response = await createUserViaHttp({ username: "validUsername" });

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Não é possível usar este nome de usuário.",
        action: "Utilize outro nome para realizar esta operação.",
        status_code: 400,
      });
    });

    test("Create user with duplicated e-mail", async () => {
      const response = await createUserViaHttp({ email: "valid.email@email.com" });

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Não é possível usar o e-mail informado.",
        action: "Utilize outro e-mail para realizar esta operação.",
        status_code: 400,
      });
    });
  });
});
