type HttpErrorJSON = {
  name: string;
  message: string;
  action: string;
  status_code: number;
};

export class InternalServerError extends Error {
  public action: string;
  public statusCode: number;

  constructor({ cause, statusCode }: { cause?: unknown; statusCode?: number }) {
    super("Um erro não esperado ocorreu.", { cause });
    this.name = "InternalServerError";
    this.action = "Entre em contato com o suporte.";
    this.statusCode = statusCode ?? 500;
  }

  toJSON(): HttpErrorJSON {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class ServiceError extends Error {
  public action: string;
  public statusCode: number;

  constructor({ cause, message }: { cause?: unknown; message?: string }) {
    super(message ?? "Serviço indisponível no momento.", { cause });
    this.name = "ServiceError";
    this.action = "Verifique se o serviço está disponível.";
    this.statusCode = 503;
  }

  toJSON(): HttpErrorJSON {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class ValidationError extends Error {
  public action: string;
  public statusCode: number;

  constructor({
    cause,
    message,
    action,
  }: {
    cause?: unknown;
    message?: string;
    action?: string;
  }) {
    super(message ?? "Um erro de validação ocorreu.", { cause });
    this.name = "ValidationError";
    this.action = action ?? "Ajuste os dados enviados e tente novamente.";
    this.statusCode = 400;
  }

  toJSON(): HttpErrorJSON {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class NotFoundError extends Error {
  public action: string;
  public statusCode: number;

  constructor({
    cause,
    message,
    action,
  }: {
    cause?: unknown;
    message?: string;
    action?: string;
  }) {
    super(message ?? "Não foi possível localizar o que você deseja no sistema.", { cause });
    this.name = "NotFoundError";
    this.action = action ?? "Verifique se os parâmetros enviados na consulta estão corretos.";
    this.statusCode = 404;
  }

  toJSON(): HttpErrorJSON {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class UnauthorizedError extends Error {
  public action: string;
  public statusCode: number;

  constructor({
    cause,
    message,
    action,
  }: {
    cause?: unknown;
    message?: string;
    action?: string;
  }) {
    super(message ?? "Usuário não autenticado.", { cause });
    this.name = "UnauthorizedError";
    this.action = action ?? "Verifique se os dados enviados estão corretos e tente novamente.";
    this.statusCode = 401;
  }

  toJSON(): HttpErrorJSON {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class MethodNotAllowedError extends Error {
  public action: string;
  public statusCode: number;

  constructor() {
    super("Método não permitido para este endpoint.");
    this.name = "MethodNotAllowedError";
    this.action = "Verifique se o método HTTP enviado para este endpoint é valido.";
    this.statusCode = 405;
  }

  toJSON(): HttpErrorJSON {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
