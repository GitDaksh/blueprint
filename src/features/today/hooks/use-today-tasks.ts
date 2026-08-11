"use client";

import { useCallback, useEffect, useState } from "react";
import { boardRepository } from "@/lib/storage/board-repository";
import { columnRepository } from "@/lib/storage/column-repository";
import { taskRepository } from "@/lib/storage/task-repository";
import { todayDateKey } from "@/lib/date-utils";
import type { Task } from "@/lib/schema";

export interface TodayTask extends Task {
  boardName: string;
}

export function useTodayTasks() {
  const [overdue, setOverdue] = useState<TodayTask[]>([]);
  const [dueToday, setDueToday] = useState<TodayTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);

    const boards = await boardRepository.getAll();
    const perBoard = await Promise.all(
      boards.map(async (board) => {
        const [columns, tasks] = await Promise.all([
          columnRepository.getByBoard(board.id),
          taskRepository.getByBoard(board.id),
        ]);
        const doneColumnIds = new Set(
          columns.filter((c) => c.title.toLowerCase() === "done").map((c) => c.id)
        );
        return { board, tasks, doneColumnIds };
      })
    );

    const key = todayDateKey();
    const overdueList: TodayTask[] = [];
    const todayList: TodayTask[] = [];

    for (const { board, tasks, doneColumnIds } of perBoard) {
      for (const task of tasks) {
        if (!task.dueDate) continue;
        if (doneColumnIds.has(task.columnId)) continue;

        const dueKey = task.dueDate.slice(0, 10);
        const annotated: TodayTask = { ...task, boardName: board.name };

        if (dueKey < key) overdueList.push(annotated);
        else if (dueKey === key) todayList.push(annotated);
      }
    }

    setOverdue(overdueList);
    setDueToday(todayList);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { overdue, dueToday, isLoading, refresh };
}