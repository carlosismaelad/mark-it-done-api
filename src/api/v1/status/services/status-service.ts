import { getStatusFromDb } from "../db-status/database-status";

export async function getStatus() {
  const dbStatus = await getStatusFromDb();
  return dbStatus;
}
