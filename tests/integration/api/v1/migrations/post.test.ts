import { clearDatabase, runMigrationsBeforeTests, waitForAllServices } from "../../../../orchestrator";

beforeAll(async () => {
  await waitForAllServices();
  await clearDatabase();
});

describe("POST /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    describe("Running pending migrations", () => {
      test("For the first time", async () => {
        //response 1
        const response1 = await fetch("http://localhost:8080/api/v1/migrations", {
          method: "POST",
        });
        expect(response1.status).toBe(201);

        const response1Body = (await response1.json()) as unknown[];

        expect(Array.isArray(response1Body)).toBe(true);
        expect(response1Body.length).toBeGreaterThan(0);
      });
      test("For the second time", async () => {
        //response 2
        const response2 = await fetch("http://localhost:8080/api/v1/migrations", {
          method: "POST",
        });
        expect(response2.status).toBe(200);

        const response2Body = (await response2.json()) as unknown[];

        expect(Array.isArray(response2Body)).toBe(true);
        expect(response2Body.length).toBe(0);
      });
    });
  });
});
