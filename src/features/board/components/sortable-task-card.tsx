"use client";

import { useSortable } from "@dnd-kit/react/sortable";
import { TaskCard } from "./task-card";
import type { Task } from "@/lib/schema";

interface SortableTaskCardProps {
  task: Task;
  index: number;
  columnId: string;
  onSelect: (task: Task) => void;
}

export function SortableTaskCard({ task, index, columnId, onSelect }: SortableTaskCardProps) {
  const { ref, isDragging } = useSortable({
    id: task.id,
    index,
    group: columnId,
    type: "task",
    accept: "task",
  });

  return (
    <div
      ref={ref}
      className={isDragging ? "opacity-40" : undefined}
      onClick={() => onSelect(task)}
    >
      <TaskCard task={task} />
    </div>
  );
}