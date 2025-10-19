import { clearDatabase, waitForAllServices } from "../../../../orchestrator";

beforeAll(async () => {
  await waitForAllServices();
  await clearDatabase();
});

describe("GET /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    test("Retrieving pending migrations", async () => {
      const response = await fetch("http://localhost:8080/api/v1/migrations");
      expect(response.status).toBe(200);

      const responseBody = (await response.json()) as unknown[];

      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody.length).toBeGreaterThan(0);
    });
  });
});
