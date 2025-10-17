import { itemRepository } from "../repository/item-repository";
import { ItemRequestDto } from "../rest/dtos/item-request-dto";
import { ItemResponseDto } from "../rest/dtos/item-response-dto";

async function create(itemInputValues: ItemRequestDto): Promise<ItemResponseDto> {
  const createdItem = await itemRepository.create(itemInputValues);

  return {
    id: createdItem.id,
    name: createdItem.name,
    mark: createdItem.mark,
    unit_price: createdItem.unit_price ? Number(createdItem.unit_price) : null,
    quantity: createdItem.quantity ? Number(createdItem.quantity) : null,
    total_price: await calculateTotalPricePerItem(createdItem),
  };
}

async function findItemById(itemId: string): Promise<ItemResponseDto> {
  const dbItem = await itemRepository.findItemById(itemId);

  return {
    id: dbItem.id,
    name: dbItem.name,
    mark: dbItem.mark,
    unit_price: dbItem.unit_price ? Number(dbItem.unit_price) : null,
    quantity: dbItem.quantity ? Number(dbItem.quantity) : null,
    total_price: await calculateTotalPricePerItem(dbItem),
  };
}

async function getAllItems(listId: string): Promise<ItemResponseDto[]> {
  const dbItemList = await itemRepository.getAllItems(listId);

  return await Promise.all(
    dbItemList.map(async dbItem => {
      return {
        id: dbItem.id,
        name: dbItem.name,
        mark: dbItem.mark,
        unit_price: dbItem.unit_price ? Number(dbItem.unit_price) : null,
        quantity: dbItem.quantity ? Number(dbItem.quantity) : null,
        total_price: await calculateTotalPricePerItem(dbItem),
      };
    })
  );
}

async function updateItem(itemId: string, itemInputValues: ItemRequestDto): Promise<ItemResponseDto> {
  const updatedItem = await itemRepository.update(itemId, itemInputValues);

  return {
    id: updatedItem.id,
    name: updatedItem.name,
    mark: updatedItem.mark,
    unit_price: updatedItem.unit_price ? Number(updatedItem.unit_price) : null,
    quantity: updatedItem.quantity ? Number(updatedItem.quantity) : null,
    total_price: await calculateTotalPricePerItem(updatedItem),
  };
}

async function deleteItem(itemId: string): Promise<void> {
  await itemRepository.deleteItem(itemId);
}

async function calculateTotalPricePerItem(item: {
  unit_price?: number;
  unitPrice?: number;
  quantity?: number;
}): Promise<number | undefined> {
  const unitPrice = item.unit_price ?? item.unitPrice;
  const quantity = item.quantity;

  if (unitPrice !== null && quantity !== null && unitPrice !== undefined && quantity !== undefined) {
    return Math.round(Number(unitPrice * quantity * 100)) / 100;
  }
  return undefined;
}

export const itemService = {
  create,
  getAllItems,
  updateItem,
  findItemById,
  deleteItem,
  calculateTotalPricePerItem,
};
