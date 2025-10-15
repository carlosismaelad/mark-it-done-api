import { ValidationError } from "../../core/errors/errors.js";
import { UserRequestDto } from "../rest/dtos/user-request-dto.js";

type UserValidationData = {
  username?: string;
  email?: string;
  password?: string;
};

// ======================== INDIVIDUAL VALIDATIONS ========================

function validateUsername(username: string, isRequired: boolean = false): void {
  if (isRequired && (!username || username.trim() === "")) {
    throw new ValidationError({
      message: "Campo 'Nome de usuário' deve estar preenchido.",
    });
  }

  if (username && username.trim() === "") {
    throw new ValidationError({
      message: "Nome de usuário não pode estar em branco.",
    });
  }

  if (username && username.length > 30) {
    throw new ValidationError({
      message: "Nome de usuário não pode conter mais de 30 caracteres.",
    });
  }
}

function validateEmail(email: string, isRequired: boolean = false): void {
  if (isRequired && (!email || email.trim() === "")) {
    throw new ValidationError({
      message: "Campo 'e-mail' deve estar preenchido.",
    });
  }

  if (email) {
    validateEmailFormat(email);
  }
}

function validatePassword(password: string, isRequired: boolean = false): void {
  if (isRequired && (!password || password.trim() === "")) {
    throw new ValidationError({
      message: "Campo 'Senha' deve estar preenchido.",
    });
  }

  if (password) {
    validatePasswordStrength(password);
  }
}

// ======================== BUSINESS VALIDATIONS ========================

export function validateUserCreation(data: UserRequestDto): void {
  validateUsername(data.username, true);
  validateEmail(data.email, true);
  validatePassword(data.password, true);
}

export function validateUserUpdate(data: UserValidationData): void {
  if (data.username !== undefined) {
    validateUsername(data.username);
  }

  if (data.email !== undefined) {
    validateEmail(data.email);
  }

  if (data.password !== undefined) {
    validatePassword(data.password);
  }
}

// ======================== AUXILIARY FUNCTIONS ========================

function validateEmailFormat(email: string): void {
  const errors = [];
  // why this regex? https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (email.trim() === "") {
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

// ======================== PUBLIC FUNCTIONS (COMPATIBILITY) ========================

export function userCreationValidation(data: UserRequestDto): void {
  validateUserCreation(data);
}

export function userUpdateValidation(data: UserValidationData): void {
  validateUserUpdate(data);
}
