"use client";

import { TaskCard } from "./task-card";
import type { Task } from "@/lib/schema";

const PRIORITY_ORDER: Task["priority"][] = ["high", "medium", "low"];

const PRIORITY_LABELS: Record<Task["priority"], string> = {
  high: "High Priority",
  medium: "Medium Priority",
  low: "Low Priority",
};

interface PriorityViewProps {
  tasks: Task[];
  onTaskSelect: (task: Task) => void;
}

export function PriorityView({ tasks, onTaskSelect }: PriorityViewProps) {
  return (
    <div className="flex flex-1 flex-wrap content-start gap-4 overflow-y-auto p-6">
      {PRIORITY_ORDER.map((priority) => {
        const group = tasks.filter((t) => t.priority === priority);
        return (
          <div key={priority} className="flex w-72 shrink-0 flex-col rounded-lg bg-muted/40 p-3">
            <div className="mb-3 flex items-center justify-between px-1">
              <h3 className="text-sm font-semibold">{PRIORITY_LABELS[priority]}</h3>
              <span className="text-xs text-muted-foreground">{group.length}</span>
            </div>
            <div className="flex flex-col gap-2">
              {group.length === 0 ? (
                <p className="px-1 text-xs text-muted-foreground">No tasks</p>
              ) : (
                group.map((task) => (
                  <div key={task.id} onClick={() => onTaskSelect(task)}>
                    <TaskCard task={task} />
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}