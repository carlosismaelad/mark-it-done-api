import { FastifyReply, FastifyRequest } from "fastify";
import { ItemRequestDto } from "./dtos/item-request-dto.js";
import {
  itemCreationValidation,
  itemUpdateValidation,
} from "../services/item-utils.js";
import { itemService } from "../services/item-service.js";

// GET /api/v1/items?listId=xxx
export async function getAllItems(
  request: FastifyRequest<{ Querystring: { listId: string } }>,
  reply: FastifyReply
) {
  const { listId } = request.query;

  if (!listId || typeof listId !== "string") {
    return reply.status(400).send({
      error: "ID da lista é obrigatório e deve ser um ID válido.",
    });
  }

  try {
    const items = await itemService.getAllItems(listId);
    return reply.status(200).send(items);
  } catch (error) {
    throw error;
  }
}

// GET /api/v1/items/:id
export async function getItemById(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = request.params;

  if (!id || typeof id !== "string") {
    return reply.status(400).send({
      error: "ID do item é obrigatório e deve ser uma string válida.",
    });
  }

  try {
    const item = await itemService.findItemById(id);
    return reply.status(200).send(item);
  } catch (error) {
    throw error;
  }
}

// POST /api/v1/items
export async function createItem(
  request: FastifyRequest<{ Body: ItemRequestDto }>,
  reply: FastifyReply
) {
  const itemInputValues: ItemRequestDto = request.body;

  try {
    itemCreationValidation(itemInputValues);
    const newItem = await itemService.create(itemInputValues);
    return reply.status(201).send(newItem);
  } catch (error) {
    throw error;
  }
}

// PATCH /api/v1/items/:id
export async function updateItem(
  request: FastifyRequest<{
    Params: { id: string };
    Body: ItemRequestDto;
  }>,
  reply: FastifyReply
) {
  const { id } = request.params;
  const itemInputValues: ItemRequestDto = request.body;

  if (!id || typeof id !== "string") {
    return reply.status(400).send({
      error: "ID do item é obrigatório e deve ser uma string válida.",
    });
  }

  try {
    itemUpdateValidation(itemInputValues);
    const updatedItem = await itemService.updateItem(id, itemInputValues);
    return reply.status(200).send(updatedItem);
  } catch (error) {
    throw error;
  }
}

// DELETE /api/v1/items/:id
export async function deleteItem(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = request.params;

  if (!id || typeof id !== "string") {
    return reply.status(400).send({
      error: "ID do item é obrigatório e deve ser uma string válida.",
    });
  }

  try {
    await itemService.deleteItem(id);
    return reply.status(204).send();
  } catch (error) {
    throw error;
  }
}
