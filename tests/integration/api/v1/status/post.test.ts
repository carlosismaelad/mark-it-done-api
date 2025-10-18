import * as orchestrator from "../../../../orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("POST /api/vi/status", () => {
  describe("Anonymous user", () => {
    test("Retrieving current system status", async () => {
      const response = await fetch("http://localhost:8080/api/v1/status", {
        method: "POST",
      });

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "Endpoint POST /api/v1/status não encontrado.",
        action: "Verifique se a URL e o método HTTP estão corretos.",
        status_code: 404,
      });
    });
  });
});
