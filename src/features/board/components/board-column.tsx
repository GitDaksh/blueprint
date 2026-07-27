"use client";

import { useDroppable } from "@dnd-kit/react";
import { CollisionPriority } from "@dnd-kit/abstract";
import type { Column, Task } from "@/lib/schema";
import { SortableTaskCard } from "./sortable-task-card";
import { CreateTaskDialog } from "./create-task-dialog";

interface BoardColumnProps {
  column: Column;
  tasks: Task[];
  boardId: string;
  onTaskCreated: () => void;
  onTaskSelect: (task: Task) => void;
}

export function BoardColumn({
  column,
  tasks,
  boardId,
  onTaskCreated,
  onTaskSelect,
}: BoardColumnProps) {
  const { ref } = useDroppable({
    id: column.id,
    type: "column",
    accept: "task",
    collisionPriority: CollisionPriority.Low,
  });

  return (
    <div className="flex w-72 shrink-0 flex-col rounded-lg bg-muted/40 p-3">
      <div className="mb-3 flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold">{column.title}</h3>
        <span className="text-xs text-muted-foreground">{tasks.length}</span>
      </div>
      <div ref={ref} className="flex min-h-8 flex-col gap-2">
        {tasks.map((task, index) => (
          <SortableTaskCard
            key={task.id}
            task={task}
            index={index}
            columnId={column.id}
            onSelect={onTaskSelect}
          />
        ))}
      </div>
      <div className="mt-2">
        <CreateTaskDialog boardId={boardId} columnId={column.id} onCreated={onTaskCreated} />
      </div>
    </div>
  );
}