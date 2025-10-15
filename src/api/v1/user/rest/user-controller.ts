import { Request, Response } from "express";
import { UserRequestDto } from "./dtos/user-request-dto.js";
import { userCreationValidation, userUpdateValidation } from "../services/user-utils.js";
import { userService } from "../services/user-services.js";
import { asyncHandler } from "../../core/middleware/async-handler.js";

// GET /api/v1/users/:username
export const getUserByUsername = asyncHandler(async (req: Request, res: Response) => {
  const { username } = req.params;

  if (!username || typeof username !== "string") {
    return res.status(400).json({
      error: "Nome de usuário inválido.",
    });
  }

  const userFound = await userService.findOneByUsername(username);
  return res.status(200).json(userFound);
});

// POST /api/v1/users
export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const userInputValues: UserRequestDto = req.body;

  userCreationValidation(userInputValues);
  const newUser = await userService.create(userInputValues);
  return res.status(201).json(newUser);
});

// PATCH /api/v1/users/:username
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { username } = req.params;
  const userInputValues: UserRequestDto = req.body;

  if (!username || typeof username !== "string") {
    return res.status(400).json({
      error: "Nome de usuário inválido.",
    });
  }

  userUpdateValidation(userInputValues);
  const updatedUser = await userService.update(username, userInputValues);
  return res.status(200).json(updatedUser);
});
