import { readStorage, writeStorage } from "./local-storage";
import { STORAGE_KEYS } from "./keys";
import { generateId } from "@/lib/id";
import { boardSchema, type Board } from "@/lib/schema";

function getAllBoards(): Board[] {
  return readStorage<Board[]>(STORAGE_KEYS.boards, []);
}

function saveAllBoards(boards: Board[]): void {
  writeStorage(STORAGE_KEYS.boards, boards);
}

export const boardRepository = {
  async getAll(): Promise<Board[]> {
    return getAllBoards();
  },

  async create(name: string): Promise<Board> {
    const now = new Date().toISOString();
    const newBoard = boardSchema.parse({
      id: generateId(),
      name,
      createdAt: now,
      updatedAt: now,
    });

    saveAllBoards([...getAllBoards(), newBoard]);
    return newBoard;
  },
};