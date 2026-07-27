"use client";

import { useCallback, useEffect, useState } from "react";
import { boardRepository } from "@/lib/storage/board-repository";
import { columnRepository } from "@/lib/storage/column-repository";
import { taskRepository } from "@/lib/storage/task-repository";
import { setLastBoardId } from "@/lib/storage/preferences";
import type { Board, Column, Task } from "@/lib/schema";

export function useBoard(boardId: string) {
  const [board, setBoard] = useState<Board | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadBoard = useCallback(async () => {
    setIsLoading(true);

    const boards = await boardRepository.getAll();
    const activeBoard = boards.find((b) => b.id === boardId) ?? null;

    if (activeBoard) {
      setLastBoardId(activeBoard.id);

      const [loadedColumns, loadedTasks] = await Promise.all([
        columnRepository.getByBoard(activeBoard.id),
        taskRepository.getByBoard(activeBoard.id),
      ]);

      setColumns(loadedColumns);
      setTasks(loadedTasks);
    } else {
      setColumns([]);
      setTasks([]);
    }

    setBoard(activeBoard);
    setIsLoading(false);
  }, [boardId]);

  useEffect(() => {
    loadBoard();
  }, [loadBoard]);

  return { board, columns, tasks, isLoading, refresh: loadBoard };
}