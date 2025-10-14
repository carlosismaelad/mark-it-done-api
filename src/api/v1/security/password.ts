import bcryptjs from "bcryptjs";

export async function hashPassword(password: string) {
  const rounds = getNumberOfRounds();
  return await bcryptjs.hash(password, rounds);
}

export async function comparePasswords(providedPassowrd: string, storedPassword: string) {
  return await bcryptjs.compare(providedPassowrd, storedPassword);
}

function getNumberOfRounds() {
  return process.env.NODE_ENV === "production" ? 14 : 1;
}
