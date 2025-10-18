import database from "@/infra/database/database";
import { UserRequestDto } from "../rest/dtos/user-request-dto";
import { NotFoundError, UnauthorizedError, ValidationError } from "@/api/v1/core/errors/errors";
import { hashPassword } from "../../security/password";

type DatabaseUser = {
  id: string;
  username: string;
  email: string;
  password: string;
  created_at: string;
  updated_at: string;
};

async function findByUsername(username: string): Promise<DatabaseUser> {
  const userFound = await runSelectQuery(username);
  return userFound;

  async function runSelectQuery(username: string) {
    const results = await database.query({
      text: `
      SELECT
        *
      FROM
        users
      WHERE
        LOWER(username) = LOWER($1)
      LIMIT
        1
      ;`,
      values: [username],
    });
    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "O username informado não foi encontrado no sistema.",
        action: "Verifique se o username está digitado corretamente.",
      });
    }
    return results.rows[0];
  }
}

async function findByEmail(email: string): Promise<DatabaseUser> {
  const userFound = await runSelectQuery(email);
  return userFound;

  async function runSelectQuery(email: string) {
    const results = await database.query({
      text: `
      SELECT
        *
      FROM
        users
      WHERE
        LOWER(email) = LOWER($1)
      LIMIT
        1
      ;`,
      values: [email],
    });
    if (results.rowCount === 0) {
      throw new UnauthorizedError({
        message: "Dados de autenticação não conferem.",
        action: "Verifique se os dados enviados estão corretos.",
      });
    }
    return results.rows[0];
  }
}

async function create(userInputValues: UserRequestDto): Promise<DatabaseUser> {
  await validateUniqueUsername(userInputValues.username);
  await validateUniqueEmail(userInputValues.email);
  await hashPasswordInObject(userInputValues);
  const newUser = await runInsertQuery(userInputValues);
  return newUser;

  async function runInsertQuery(userInputValues: UserRequestDto) {
    const results = await database.query({
      text: `
        INSERT INTO
        users (username, email, password)
      VALUES
        ($1, $2, $3)
      RETURNING
        *
      ;`,
      values: [userInputValues.username, userInputValues.email, userInputValues.password],
    });
    return results.rows[0];
  }
}

async function validateUniqueUsername(username: string) {
  const results = await database.query({
    text: `
      SELECT
        username
      FROM
        users
      WHERE
        LOWER(username) = LOWER($1)
      ;`,
    values: [username],
  });
  if (results.rowCount && results.rowCount > 0) {
    throw new ValidationError({
      message: "Não foi possível usar este nome de usuário.",
      action: "Utilize outro username para realizar esta operação.",
    });
  }
}

async function update(username: string, user: UserRequestDto): Promise<DatabaseUser> {
  const currentUser = await findByUsername(username);

  if ("username" in user) {
    await validateUniqueUsername(user.username);
  }

  if ("email" in user) {
    await validateUniqueEmail(user.email);
  }

  if ("password" in user) {
    await hashPasswordInObject(user);
  }
  const userWithNewValues = {
    id: currentUser.id,
    username: user.username ?? currentUser.username,
    email: user.email ?? currentUser.email,
    password: user.password ?? currentUser.password,
  };
  const updatedUser = await runUpdateQuery(userWithNewValues);
  return updatedUser;

  async function runUpdateQuery(userWithNewValues: UserRequestDto) {
    const results = await database.query({
      text: `
        UPDATE
          users
        SET
          username = $2,
          email = $3,
          password = $4,
          updated_at = timezone('utc', now())
        WHERE
          id = $1
        RETURNING
          *
        ;`,
      values: [userWithNewValues.id, userWithNewValues.username, userWithNewValues.email, userWithNewValues.password],
    });
    return results.rows[0];
  }
}

async function validateUniqueEmail(email: string) {
  const results = await database.query({
    text: `
      SELECT
        email
      FROM
        users
      WHERE
        LOWER(email) = LOWER($1)
      ;`,
    values: [email],
  });
  if (results.rowCount && results.rowCount > 0) {
    throw new ValidationError({
      message: "Não é possível usar o e-mail informado.",
      action: "Utilize outro e-mail para realizar esta operação.",
    });
  }
}

async function hashPasswordInObject(userInputValues: UserRequestDto) {
  const hashedPassword = await hashPassword(userInputValues.password);
  userInputValues.password = hashedPassword;
}

export const userRepository = {
  create,
  update,
  findByUsername,
  findByEmail,
};

export default userRepository;
