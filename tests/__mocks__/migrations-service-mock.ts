// Mock que usa CLI do node-pg-migrate para testes de integração reais
import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

export async function runPendingMigrations(): Promise<unknown[]> {
  try {
    // Executa o comando migrations:up do package.json
    const { stdout } = await execAsync("npm run migrations:up", {
      cwd: process.cwd(),
      env: process.env,
    });

    // Parse da saída para extrair migrações executadas
    const migrations = parseMigrationOutput(stdout);
    return migrations;
  } catch (error) {
    console.error("Error running migrations:", error);
    return [];
  }
}

export async function listPendingMigrations(): Promise<unknown[]> {
  try {
    // Lista migrações pendentes usando dry-run
    const { stdout } = await execAsync(
      "npx node-pg-migrate --migrations-dir src/infra/database/migrations --envPath .env.development --dry-run up",
      {
        cwd: process.cwd(),
        env: process.env,
      }
    );

    // Parse da saída para extrair migrações pendentes
    const migrations = parseMigrationOutput(stdout);
    return migrations;
  } catch (error) {
    console.error("Error listing pending migrations:", error);
    return [];
  }
}

function parseMigrationOutput(output: string): unknown[] {
  // Parse básico da saída do node-pg-migrate
  const lines = output.split("\n").filter(line => line.includes(".js"));
  return lines
    .map(line => {
      const match = line.match(/(\d+_[\w-]+)\.js/);
      return match
        ? {
            name: match[1],
            path: line.includes("src/") ? line : `src/infra/database/migrations/${match[1]}.js`,
          }
        : null;
    })
    .filter(Boolean);
}
