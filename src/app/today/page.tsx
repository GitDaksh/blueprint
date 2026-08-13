"use client";

import Link from "next/link";
import { AlertCircle, CalendarCheck, Sun } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTodayTasks, type TodayTask } from "@/features/today/hooks/use-today-tasks";
import { priorityStyles } from "@/lib/priority-styles";
import { CornerMarks } from "@/components/corner-marks";

function TaskRow({ task }: { task: TodayTask }) {
  return (
    <Link
      href={`/board/${task.boardId}?taskId=${task.id}`}
      className="group relative flex items-center justify-between gap-3 rounded-lg border border-border p-3 transition-colors hover:border-primary/40 hover:bg-muted/50"
    >
      <CornerMarks className="opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
      <div className="flex min-w-0 flex-col gap-1">
        <span className="truncate text-sm font-medium">{task.title}</span>
        <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
          {task.boardName}
        </span>
      </div>
      <Badge variant="outline" className={priorityStyles[task.priority]}>
        {task.priority}
      </Badge>
    </Link>
  );
}

export default function TodayPage() {
  const { overdue, dueToday, isLoading } = useTodayTasks();

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  const isEmpty = overdue.length === 0 && dueToday.length === 0;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-6">
      <h1 className="font-heading text-2xl font-semibold">Today</h1>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
          <Sun className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Nothing due today or overdue. Add a due date to a task to see it here.
          </p>
        </div>
      ) : (
        <>
          {overdue.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm font-medium text-destructive">
                <AlertCircle className="h-4 w-4" />
                Overdue (<span className="font-mono">{overdue.length}</span>)
              </div>
              <div className="flex flex-col gap-2">
                {overdue.map((task) => (
                  <TaskRow key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}

          {dueToday.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <CalendarCheck className="h-4 w-4" />
                Due Today (<span className="font-mono">{dueToday.length}</span>)
              </div>
              <div className="flex flex-col gap-2">
                {dueToday.map((task) => (
                  <TaskRow key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}