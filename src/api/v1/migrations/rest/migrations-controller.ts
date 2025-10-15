import { Request, Response } from "express";
import { listPendingMigrations, runPendingMigrations } from "../service/migrations-service";

export async function getPendingMigrations(req: Request, res: Response) {
  const pendingMigrations = await listPendingMigrations();
  return res.status(200).json(pendingMigrations);
}

export async function runMigrations(req: Request, res: Response) {
  const migratedMigration = await runPendingMigrations();

  if (migratedMigration.length > 0) {
    return res.status(201).json(migratedMigration);
  }

  return res.status(200).json({ message: "No pending migrations" });
}
