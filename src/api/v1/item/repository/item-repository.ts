import database from "@/infra/database/database";
import { ItemRequestDto } from "../rest/dtos/item-request-dto";

type DatabaseItem = {
  id: string;
  name: string;
  mark?: string;
  unit_price?: number;
  quantity?: number;
  created_at: string;
  updated_at: string;
};

async function create(itemInputValues: ItemRequestDto): Promise<DatabaseItem> {
  const dbItem = await runInsertQuery(itemInputValues);
  return dbItem;

  async function runInsertQuery(itemInputValues: ItemRequestDto) {
    const results = await database.query({
      text: `
        INSERT INTO 
          items (name, mark, unit_price, quantity) 
        VALUES 
          ($1, $2, $3, $4)
        RETURNING
          *
        ;`,
      values: [itemInputValues.name, itemInputValues.mark, itemInputValues.unitPrice, itemInputValues.quantity],
    });
    return results.rows[0];
  }
}

async function update(itemId: string, itemInputValues: ItemRequestDto): Promise<DatabaseItem> {
  const currentItem = await findItemById(itemId);

  const updatedFields = {
    name: itemInputValues.name ?? currentItem.name,
    mark: itemInputValues.mark ?? currentItem.mark,
    unit_price: itemInputValues.unitPrice ?? currentItem.unit_price,
    quantity: itemInputValues.quantity ?? currentItem.quantity,
  };

  const updatedItem = await runUpdateQuery(updatedFields);
  return updatedItem;

  async function runUpdateQuery(fields: { name: string; mark?: string; unit_price?: number; quantity?: number }) {
    const results = await database.query({
      text: `
        UPDATE
          items
        SET
          name = $2,
          mark = $3,
          unit_price = $4,
          quantity = $5,
          updated_at = timezone('utc', now())
        WHERE
          id = $1
        RETURNING
          *
        ;`,
      values: [itemId, fields.name, fields.mark, fields.unit_price, fields.quantity],
    });
    return results.rows[0];
  }
}

async function findItemById(itemId: string): Promise<DatabaseItem> {
  const results = await database.query({
    text: `
      SELECT 
        *
      FROM 
        items
      WHERE
       id = $1
      LIMIT
        1
      ;`,
    values: [itemId],
  });
  return results.rows[0];
}

async function getAllItems(listId: string): Promise<DatabaseItem[]> {
  const results = await database.query({
    text: `
      SELECT 
        *
      FROM 
        items
      WHERE
       list_id = $1
      ORDER BY
        created_at DESC
      ;`,
    values: [listId],
  });
  return results.rows;
}

async function deleteItem(itemId: string): Promise<void> {
  await database.query({
    text: `
      DELETE FROM 
        items
      WHERE
        id = $1
      ;`,
    values: [itemId],
  });
}

export const itemRepository = {
  create,
  getAllItems,
  update,
  findItemById,
  deleteItem,
};
