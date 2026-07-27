"use client";

import { useEffect, useRef, useState } from "react";
import { taskRepository } from "@/lib/storage/task-repository";
import type { Column, Task } from "@/lib/schema";

export type TaskGroups = Record<string, Task[]>;

function groupTasksByColumn(tasks: Task[], columns: Column[]): TaskGroups {
  const groups: TaskGroups = {};
  for (const column of columns) {
    groups[column.id] = tasks
      .filter((t) => t.columnId === column.id)
      .sort((a, b) => a.order - b.order);
  }
  return groups;
}

export function useBoardGroups(tasks: Task[], columns: Column[], onPersisted: () => void) {
  const [groups, setGroups] = useState<TaskGroups>(() => groupTasksByColumn(tasks, columns));
  const isDragging = useRef(false);
  const snapshot = useRef<TaskGroups>(groups);

  useEffect(() => {
    if (!isDragging.current) {
      setGroups(groupTasksByColumn(tasks, columns));
    }
  }, [tasks, columns]);

  async function persist(finalGroups: TaskGroups) {
    const updates = Object.entries(finalGroups).flatMap(([columnId, columnTasks]) =>
      columnTasks.map((task, index) => ({ id: task.id, columnId, order: index }))
    );
    await taskRepository.reorder(updates);
    onPersisted();
  }

  return { groups, setGroups, isDragging, snapshot, persist };
}