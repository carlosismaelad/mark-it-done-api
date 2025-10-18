import retry from "async-retry";
import database from "../src/infra/database/database";
import { faker } from "@faker-js/faker";
import { userService } from "../src/api/v1/user/services/user-services";
import { runPendingMigrations } from "../src/api/v1/migrations/service/migrations-service";
import { createSessionWithAuth } from "../src/api/v1/session/service/session-service";

interface EmailItem {
  id: string;
  text?: string;
  subject?: string;
  [key: string]: unknown;
}

const emailHttpURL = `http://${process.env.EMAIL_HTTP_HOST}:${process.env.EMAIL_HTTP_PORT}`;

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

interface UserObject {
  username?: string;
  email?: string;
  password?: string;
}

export async function createUserOrchestrator(userObject?: UserObject) {
  return await userService.create({
    username: userObject?.username || faker.internet.username().replace(/[_.-]/g, ""),
    email: userObject?.email || faker.internet.email(),
    password: userObject?.password || "validpassword",
  });
}

export async function createSession(userId: string) {
  return await createSessionWithAuth(userId);
}

export async function deleteAllEmails() {
  await fetch(`${emailHttpURL}/messages`, {
    method: "DELETE",
  });
}

export async function getLastEmail() {
  const emailListResponse = await fetch(`${emailHttpURL}/messages`);
  const emailListBody = (await emailListResponse.json()) as unknown[];
  const lastEmailItem = emailListBody.pop() as EmailItem;

  if (!lastEmailItem) {
    return null;
  }

  const emailTextResponse = await fetch(`${emailHttpURL}/messages/${lastEmailItem.id}.plain`);
  const emailTextBody = await emailTextResponse.text();
  lastEmailItem.text = emailTextBody;
  return lastEmailItem;
}
