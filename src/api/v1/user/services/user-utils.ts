import { ValidationError } from "../../../../infra/errors/errors.js";
import { UserRequestDto } from "../rest/dtos/user-request-dto.js";

type userValidationData = {
  username?: string;
  email?: string;
  password?: string;
};

export function validateUserInputs(data: userValidationData, isCreation: boolean = false): void {
  if (isCreation) {
    if (!data.username || data.username.trim() === "") {
      throw new ValidationError({
        message: "Campo 'Nome de usuário' deve estar preenchido.",
      });
    }

    if (data.username.length > 30) {
      throw new ValidationError({
        message: "Nome de usuário não pode conter mais de 30 caracteres.",
      });
    }

    if (!data.email || data.email.trim() === "") {
      throw new ValidationError({
        message: "Campo 'e-mail deve estar preenchido.",
      });
    }

    if (!data.password || data.password.trim() === "") {
      throw new ValidationError({
        message: "Campo 'Senha' deve estar preenchido.",
      });
    }

    validatePasswordStrength(data.password);
    validateEmailFormat(data.email);
  } else {
    if (data.username !== undefined && (!data.username || data.username.trim() === "")) {
      throw new ValidationError({
        message: "Nome de usuário não pode estar em branco.",
      });
    }

    if (data.username !== undefined && data.username.length > 30) {
      throw new ValidationError({
        message: "Nome de usuário não pode conter mais de 30 caracteres.",
      });
    }

    if (data.email) {
      validateEmailFormat(data.email);
    }
  }
}

function validateEmailFormat(email: string): void {
  const errors = [];
  // why this regex? https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (email !== undefined && email.trim() === "") {
    errors.push("e-mail não pode estar em branco.");
  }

  if (!emailRegex.test(email)) {
    errors.push("deve ser um e-mail válido pois enviaremos o código de autenticação para ele.");
  }

  if (errors.length > 0) {
    throw new ValidationError({
      message: `Algo errado com o seu e-mail: ${errors.join(", ")}`,
    });
  }
}

function validatePasswordStrength(password: string): void {
  const errors = [];

  if (password.length < 8) {
    errors.push("pelo menos 8 caracteres");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("pelo menos uma letra minúscula");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("pelo menos uma letra maiúscula");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("pelo menos um número");
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('pelo menos um caractere especial (!@#$%^&*(),.?":{}|<>)');
  }

  if (errors.length > 0) {
    throw new ValidationError({
      message: `Senha deve conter: ${errors.join(", ")}.`,
    });
  }
}

export function userCreationValidation(data: UserRequestDto): void {
  validateUserInputs(data, true);
}

export function userUpdateValidation(data: userValidationData): void {
  validateUserInputs(data, false);
}
