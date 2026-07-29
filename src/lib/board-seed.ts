import { boardRepository } from "./storage/board-repository";
import { columnRepository } from "./storage/column-repository";
import type { Board } from "./schema";

const DEFAULT_COLUMNS = ["To Do", "In Progress", "Done"];

export async function createBoardWithDefaultColumns(name: string): Promise<Board> {
  const board = await boardRepository.create(name);

  for (const title of DEFAULT_COLUMNS) {
    await columnRepository.create({ boardId: board.id, title });
  }

  return board;
}