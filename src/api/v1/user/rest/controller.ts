import { FastifyReply, FastifyRequest } from "fastify";
import { UserRequestDto } from "./dtos/user-request-dto.js";
import {
  userCreationValidation,
  userUpdateValidation,
} from "../services/user-utils.js";
import { userService } from "../services/user-services.js";

// GET /api/v1/users/:username
export async function getUserByUsername(
  request: FastifyRequest<{ Params: { username: string } }>,
  reply: FastifyReply
) {
  const { username } = request.params;

  if (!username || typeof username !== "string") {
    return reply.status(400).send({
      error: "Nome de usuário inválido.",
    });
  }

  try {
    const userFound = await userService.findOneByUsername(username);
    return reply.status(200).send(userFound);
  } catch (error) {
    throw error;
  }
}

// POST /api/v1/users
export async function createUser(
  request: FastifyRequest<{ Body: UserRequestDto }>,
  reply: FastifyReply
) {
  const userInputValues: UserRequestDto = request.body;

  try {
    userCreationValidation(userInputValues);
    const newUser = await userService.create(userInputValues);
    return reply.status(201).send(newUser);
  } catch (error) {
    throw error;
  }
}

// PATCH /api/v1/users/:username
export async function updateUser(
  request: FastifyRequest<{
    Params: { username: string };
    Body: UserRequestDto;
  }>,
  reply: FastifyReply
) {
  const { username } = request.params;
  const userInputValues: UserRequestDto = request.body;

  if (!username || typeof username !== "string") {
    return reply.status(400).send({
      error: "Nome de usuário inválido.",
    });
  }

  try {
    userUpdateValidation(userInputValues);
    const updatedUser = await userService.update(username, userInputValues);
    return reply.status(200).send(updatedUser);
  } catch (error) {
    throw error;
  }
}
