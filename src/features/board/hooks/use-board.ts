"use client";

import { useEffect, useState, useCallback } from "react";
import { boardRepository } from "@/lib/storage/board-repository";
import { columnRepository } from "@/lib/storage/column-repository";
import { taskRepository } from "@/lib/storage/task-repository";
import type { Board, Column, Task } from "@/lib/schema";

const DEFAULT_COLUMNS = ["To Do", "In Progress", "Done"];

export function useBoard() {
  const [board, setBoard] = useState<Board | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadBoard = useCallback(async () => {
    setIsLoading(true);

    const boards = await boardRepository.getAll();
    let activeBoard = boards[0];

    if (!activeBoard) {
      activeBoard = await boardRepository.create("My Board");
      for (const title of DEFAULT_COLUMNS) {
        await columnRepository.create({ boardId: activeBoard.id, title });
      }
    }

    const [loadedColumns, loadedTasks] = await Promise.all([
      columnRepository.getByBoard(activeBoard.id),
      taskRepository.getByBoard(activeBoard.id),
    ]);

    setBoard(activeBoard);
    setColumns(loadedColumns);
    setTasks(loadedTasks);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadBoard();
  }, [loadBoard]);

  return { board, columns, tasks, isLoading, refresh: loadBoard };
}