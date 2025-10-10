// @ts-ignore - async-retry não tem tipos oficiais
import retry from "async-retry";
import database from "../src/infra/database/database";
import { runPendingMigrations } from "../src/api/v1/migrations/service/migrations-service.js";

export async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    });
  }

  async function fetchStatusPage() {
    const response = await fetch("http://localhost:8080/api/v1/status");

    if (response.status != 200) {
      throw Error();
    }
  }
}

export async function clearDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

export async function runMigrationsBeforeTests() {
  await runPendingMigrations();
}
