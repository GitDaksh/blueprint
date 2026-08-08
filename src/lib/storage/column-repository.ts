import { readStorage, writeStorage } from "./local-storage";
import { STORAGE_KEYS } from "./keys";
import { generateId } from "@/lib/id";
import { columnSchema, type Column } from "@/lib/schema";

function getAllColumns(): Column[] {
  return readStorage<Column[]>(STORAGE_KEYS.columns, []);
}

function saveAllColumns(columns: Column[]): void {
  writeStorage(STORAGE_KEYS.columns, columns);
}

export const columnRepository = {
  async getAll(): Promise<Column[]> {
    return getAllColumns();
  },

  async getByBoard(boardId: string): Promise<Column[]> {
    return getAllColumns()
      .filter((c) => c.boardId === boardId)
      .sort((a, b) => a.order - b.order);
  },

  async create(input: Omit<Column, "id" | "order">): Promise<Column> {
    const columns = getAllColumns();
    const siblingCount = columns.filter((c) => c.boardId === input.boardId).length;

    const newColumn = columnSchema.parse({
      ...input,
      id: generateId(),
      order: siblingCount,
    });

    saveAllColumns([...columns, newColumn]);
    return newColumn;
  },

  async update(id: string, updates: Partial<Column>): Promise<Column> {
    const columns = getAllColumns();
    const index = columns.findIndex((c) => c.id === id);
    if (index === -1) throw new Error(`Column ${id} not found`);

    const updated = columnSchema.parse({ ...columns[index], ...updates });
    columns[index] = updated;
    saveAllColumns(columns);
    return updated;
  },

  async remove(id: string): Promise<void> {
    saveAllColumns(getAllColumns().filter((c) => c.id !== id));
  },
};