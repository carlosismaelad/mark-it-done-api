import { ValidationError } from "../../../../infra/errors/errors.js";
import { ItemRequestDto } from "../rest/dtos/item-request-dto.js";

type ItemValidationData = {
  name?: string;
  mark?: string;
  unitPrice?: number;
  quantity?: number;
};

export function validateItem(
  data: ItemValidationData,
  isCreation: boolean = true
): void {
  if (isCreation) {
    if (!data.name || data.name.trim() === "") {
      throw new ValidationError({
        message: "Nome do item não pode estar em branco.",
      });
    }
  } else {
    if (data.name !== undefined && (!data.name || data.name.trim() === "")) {
      throw new ValidationError({
        message: "Nome do item não pode estar em branco.",
      });
    }
  }

  if (data.unitPrice !== undefined && data.unitPrice < 0) {
    throw new ValidationError({
      message: `Valor do item não pode ser negativo.`,
    });
  }

  if (data.unitPrice !== undefined && typeof data.unitPrice !== "number") {
    throw new ValidationError({
      message: `Valor do item precisa ser um número.`,
    });
  }

  if (data.quantity !== undefined && data.quantity < 0) {
    throw new ValidationError({
      message: `Quantidade não pode ser negativo.`,
    });
  }

  if (data.quantity !== undefined && typeof data.quantity !== "number") {
    throw new ValidationError({
      message: `Quantidade do item precisa ser um número.`,
    });
  }

  if (data.mark !== undefined && typeof data.mark !== "string") {
    throw new ValidationError({
      message: `Nome da marca precisa ser um nome válido.`,
    });
  }
}

export function itemCreationValidation(data: ItemRequestDto): void {
  validateItem(data, true);
}

export function itemUpdateValidation(data: ItemValidationData): void {
  validateItem(data, false);
}
