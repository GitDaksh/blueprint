"use client";

import { motion } from "motion/react";
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
    <div ref={ref} onClick={() => onSelect(task)}>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{
          opacity: isDragging ? 0.4 : 1,
          y: 0,
          scale: isDragging ? 1.03 : 1,
        }}
        transition={{ duration: 0.15, delay: index * 0.03 }}
        className={isDragging ? "shadow-lg shadow-primary/20" : undefined}
      >
        <TaskCard task={task} />
      </motion.div>
    </div>
  );
}