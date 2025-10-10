import { clearDatabase, runMigrationsBeforeTests, waitForAllServices } from "../../../../orchestrator";

beforeAll(async () => {
  await waitForAllServices();
  // await clearDatabase();
  // await runMigrationsBeforeTests();
});

describe("GET /api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Getting current system status", async () => {
      const response = await fetch("http://localhost:8080/api/v1/status");
      expect(response.status).toBe(200);

      const responseBody = (await response.json()) as any;

      const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
      expect(responseBody.updated_at).toEqual(parsedUpdatedAt);

      expect(responseBody.dependencies.database.version).toEqual("16.0");
      expect(responseBody.dependencies.database.max_connections).toEqual(100);
      expect(responseBody.dependencies.database.opened_connections).toEqual(2);
    });
  });
});
