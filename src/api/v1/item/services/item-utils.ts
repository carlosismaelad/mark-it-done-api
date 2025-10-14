import { ValidationError } from "../../core/errors/errors.js";
import type { ItemRequestDto } from "../rest/dtos/item-request-dto.js";

type ItemValidationData = {
  name?: string;
  mark?: string;
  unitPrice?: number;
  quantity?: number;
};

// ======================== INDIVIDUAL VALIDATIONS ========================

function validateItemName(name: string, isRequired: boolean = false): void {
  if (isRequired && (!name || name.trim() === "")) {
    throw new ValidationError({
      message: "Nome do item não pode estar em branco.",
    });
  }

  if (name && name.trim() === "") {
    throw new ValidationError({
      message: "Nome do item não pode estar em branco.",
    });
  }

  if (name && name.length > 60) {
    throw new ValidationError({
      message: "Nome do item não pode conter mais de 60 caracteres.",
    });
  }
}

function validateItemMark(mark: string): void {
  if (typeof mark !== "string") {
    throw new ValidationError({
      message: "Nome da marca precisa ser um nome válido.",
    });
  }

  if (mark && mark.length > 60) {
    throw new ValidationError({
      message: "Nome da marca não pode conter mais de 60 caracteres.",
    });
  }
}

function validateUnitPrice(unitPrice: number): void {
  if (typeof unitPrice !== "number") {
    throw new ValidationError({
      message: "Valor do item precisa ser um número.",
    });
  }

  if (unitPrice < 0) {
    throw new ValidationError({
      message: "Valor do item não pode ser negativo.",
    });
  }

  if (unitPrice > 99999999.99) {
    throw new ValidationError({
      message: "Valor do item é muito alto (máximo: 99.999.999,99).",
    });
  }
}

function validateQuantity(quantity: number): void {
  if (typeof quantity !== "number") {
    throw new ValidationError({
      message: "Quantidade do item precisa ser um número.",
    });
  }

  if (quantity < 0) {
    throw new ValidationError({
      message: "Quantidade não pode ser negativa.",
    });
  }

  if (quantity > 99999999.99) {
    throw new ValidationError({
      message: "Quantidade é muito alta (máximo: 99.999.999,99).",
    });
  }
}

// ======================== BUSINESS VALIDATIONS ========================

export function validateItemCreation(data: ItemRequestDto): void {
  validateItemName(data.name, true);

  if (data.mark !== undefined) {
    validateItemMark(data.mark);
  }

  if (data.unitPrice !== undefined) {
    validateUnitPrice(data.unitPrice);
  }

  if (data.quantity !== undefined) {
    validateQuantity(data.quantity);
  }
}

export function validateItemUpdate(data: ItemValidationData): void {
  if (data.name !== undefined) {
    validateItemName(data.name);
  }

  if (data.mark !== undefined) {
    validateItemMark(data.mark);
  }

  if (data.unitPrice !== undefined) {
    validateUnitPrice(data.unitPrice);
  }

  if (data.quantity !== undefined) {
    validateQuantity(data.quantity);
  }
}

// ======================== PUBLIC FUNCTIONS (COMPATIBILITY) ========================

export function itemCreationValidation(data: ItemRequestDto): void {
  validateItemCreation(data);
}

export function itemUpdateValidation(data: ItemValidationData): void {
  validateItemUpdate(data);
}
