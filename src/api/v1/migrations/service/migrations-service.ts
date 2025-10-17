import { resolve } from "node:path";
import database from "../../../../infra/database/database";
import { runner } from "node-pg-migrate";

const defaultMigrationsOptions = {
  dryRun: true,
  dir: resolve("src", "infra", "database", "migrations"),
  direction: "up" as const,
  log: () => {},
  migrationsTable: "pgmigrations",
};

export async function listPendingMigrations(): Promise<unknown[]> {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const pendingMigrations = await runner({
      ...defaultMigrationsOptions,
      dbClient,
    });
    return pendingMigrations;
  } finally {
    await dbClient?.end();
  }
}

export async function runPendingMigrations(): Promise<unknown[]> {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const migratedMigrations = await runner({
      ...defaultMigrationsOptions,
      dbClient,
      dryRun: false,
    });
    return migratedMigrations;
  } finally {
    await dbClient?.end();
  }
}
