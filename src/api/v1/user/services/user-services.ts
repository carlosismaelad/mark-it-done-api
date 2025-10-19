import { UserRequestDto } from "../rest/dtos/user-request-dto";
import { CreatedUserResponseDto } from "../rest/dtos/created-user-response-dto";
import { userRepository } from "../repository/user-repository";
import { UserResponseDto } from "../rest/dtos/user-response-dto";

async function findOneByUsername(username: string): Promise<UserResponseDto> {
  const user = await userRepository.findByUsername(username);

  return {
    id: user.id,
    username: user.username,
    created_at: user.created_at,
  };
}

async function create(user: UserRequestDto): Promise<CreatedUserResponseDto> {
  const newUser = await userRepository.create(user);

  return {
    id: newUser.id,
    username: newUser.username,
  };
}

async function update(username: string, userInputValues: UserRequestDto): Promise<UserResponseDto> {
  const updatedUser = await userRepository.update(username, userInputValues);

  return {
    id: updatedUser.id,
    username: updatedUser.username,
    updated_at: updatedUser.updated_at,
  };
}

export const userService = {
  create,
  findOneByUsername,
  update,
};
