import crypto from "node:crypto";

export function generateVerificationCode(): string {
  const randomNum = crypto.randomInt(0, 1000000);
  return randomNum.toString().padStart(6, "0");
}

export function generateToken(): string {
  return crypto.randomBytes(48).toString("hex");
}
