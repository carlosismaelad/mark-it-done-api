import { Request, Response } from "express";
import { ItemRequestDto } from "./dtos/item-request-dto.js";
import { itemCreationValidation, itemUpdateValidation } from "../services/item-utils.js";
import { itemService } from "../services/item-service.js";

// GET /api/v1/items?listId=xxx
export async function getAllItems(req: Request, res: Response) {
  const { listId } = req.query;

  if (!listId || typeof listId !== "string") {
    return res.status(400).json({
      error: "ID da lista é obrigatório e deve ser um ID válido.",
    });
  }

  try {
    const items = await itemService.getAllItems(listId);
    return res.status(200).json(items);
  } catch (error) {
    throw error;
  }
}

// GET /api/v1/items/:id
export async function getItemById(req: Request, res: Response) {
  const { id } = req.params;

  if (!id || typeof id !== "string") {
    return res.status(400).json({
      error: "ID do item é obrigatório e deve ser uma string válida.",
    });
  }

  try {
    const item = await itemService.findItemById(id);
    return res.status(200).json(item);
  } catch (error) {
    throw error;
  }
}

// POST /api/v1/items
export async function createItem(req: Request, res: Response) {
  const itemInputValues: ItemRequestDto = req.body;

  try {
    itemCreationValidation(itemInputValues);
    const newItem = await itemService.create(itemInputValues);
    return res.status(201).json(newItem);
  } catch (error) {
    throw error;
  }
}

// PATCH /api/v1/items/:id
export async function updateItem(req: Request, res: Response) {
  const { id } = req.params;
  const itemInputValues: ItemRequestDto = req.body;

  if (!id || typeof id !== "string") {
    return res.status(400).json({
      error: "ID do item é obrigatório e deve ser uma string válida.",
    });
  }

  try {
    itemUpdateValidation(itemInputValues);
    const updatedItem = await itemService.updateItem(id, itemInputValues);
    return res.status(200).json(updatedItem);
  } catch (error) {
    throw error;
  }
}

// DELETE /api/v1/items/:id
export async function deleteItem(req: Request, res: Response) {
  const { id } = req.params;

  if (!id || typeof id !== "string") {
    return res.status(400).json({
      error: "ID do item é obrigatório e deve ser uma string válida.",
    });
  }

  try {
    await itemService.deleteItem(id);
    return res.status(204).send();
  } catch (error) {
    throw error;
  }
}
