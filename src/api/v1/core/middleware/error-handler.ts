import { Request, Response, NextFunction } from "express";
import {
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ServiceError,
  InternalServerError,
  MethodNotAllowedError,
} from "../errors/errors.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  console.error(`[${new Date().toISOString()}] Error:`, {
    name: err.name,
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err.toJSON());
  }

  if (err instanceof NotFoundError) {
    return res.status(err.statusCode).json(err.toJSON());
  }

  if (err instanceof UnauthorizedError) {
    return res.status(err.statusCode).json(err.toJSON());
  }

  if (err instanceof ServiceError) {
    return res.status(err.statusCode).json(err.toJSON());
  }

  if (err instanceof MethodNotAllowedError) {
    return res.status(err.statusCode).json(err.toJSON());
  }

  if (err instanceof InternalServerError) {
    return res.status(err.statusCode).json(err.toJSON());
  }

  const internalError = new InternalServerError({ cause: err });
  return res.status(internalError.statusCode).json(internalError.toJSON());
}

export function notFoundHandler(req: Request, res: Response) {
  const notFoundError = new NotFoundError({
    message: `Endpoint ${req.method} ${req.path} não encontrado.`,
    action: "Verifique se a URL e o método HTTP estão corretos.",
  });

  return res.status(notFoundError.statusCode).json(notFoundError.toJSON());
}
