"use client";

import { useDroppable } from "@dnd-kit/react";
import { CollisionPriority } from "@dnd-kit/abstract";
import type { Column, Task } from "@/lib/schema";
import { SortableTaskCard } from "./sortable-task-card";
import { CreateTaskDialog } from "./create-task-dialog";
import { cn } from "@/lib/utils";

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
  const { ref, isDropTarget } = useDroppable({
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
      <div
        ref={ref}
        className={cn(
          "flex min-h-8 flex-1 flex-col gap-2 rounded-md transition-colors",
          tasks.length === 0 &&
            "min-h-24 items-center justify-center border border-dashed border-border text-center",
          isDropTarget && "border-primary/50 bg-primary/5"
        )}
      >
        {tasks.length === 0 ? (
          <p className="px-4 text-xs text-muted-foreground">Drop tasks here</p>
        ) : (
          tasks.map((task, index) => (
            <SortableTaskCard
              key={task.id}
              task={task}
              index={index}
              columnId={column.id}
              onSelect={onTaskSelect}
            />
          ))
        )}
      </div>
      <div className="mt-2">
        <CreateTaskDialog boardId={boardId} columnId={column.id} onCreated={onTaskCreated} />
      </div>
    </div>
  );
}