import { Request, Response } from "express";
import { ItemRequestDto } from "./dtos/item-request-dto.js";
import { itemCreationValidation, itemUpdateValidation } from "../services/item-utils.js";
import { itemService } from "../services/item-service.js";

export async function getAllItems(req: Request, res: Response) {
  const { listId } = req.query;

  if (!listId || typeof listId !== "string") {
    return res.status(400).json({
      error: "ID da lista é obrigatório e deve ser um ID válido.",
    });
  }

  const items = await itemService.getAllItems(listId);
  return res.status(200).json(items);
}

export async function getItemById(req: Request, res: Response) {
  const { id } = req.params;

  if (!id || typeof id !== "string") {
    return res.status(400).json({
      error: "ID do item é obrigatório e deve ser uma string válida.",
    });
  }

  const item = await itemService.findItemById(id);
  return res.status(200).json(item);
}

export async function createItem(req: Request, res: Response) {
  const itemInputValues: ItemRequestDto = req.body;

  itemCreationValidation(itemInputValues);
  const newItem = await itemService.create(itemInputValues);
  return res.status(201).json(newItem);
}

export async function updateItem(req: Request, res: Response) {
  const { id } = req.params;
  const itemInputValues: ItemRequestDto = req.body;

  if (!id || typeof id !== "string") {
    return res.status(400).json({
      error: "ID do item é obrigatório e deve ser uma string válida.",
    });
  }

  itemUpdateValidation(itemInputValues);
  const updatedItem = await itemService.updateItem(id, itemInputValues);
  return res.status(200).json(updatedItem);
}

export async function deleteItem(req: Request, res: Response) {
  const { id } = req.params;

  if (!id || typeof id !== "string") {
    return res.status(400).json({
      error: "ID do item é obrigatório e deve ser uma string válida.",
    });
  }

  await itemService.deleteItem(id);
  return res.status(204).send();
}
