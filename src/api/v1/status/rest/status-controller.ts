import { Request, Response } from "express";
import { getStatus } from "../services/status-service";

export async function getDatabaseStatus(req: Request, res: Response) {
  const status = await getStatus();
  return res.status(200).json(status);
}
