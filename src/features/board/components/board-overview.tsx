"use client";

import Link from "next/link";
import { AlertCircle, CalendarClock } from "lucide-react";
import { useBoardStats } from "../hooks/use-board-stats";
import type { Column, Task } from "@/lib/schema";

interface BoardOverviewProps {
  tasks: Task[];
  columns: Column[];
}

const PRIORITY_COLOR: Record<Task["priority"], string> = {
  high: "bg-red-500/60",
  medium: "bg-amber-500/60",
  low: "bg-blue-500/60",
};

export function BoardOverview({ tasks, columns }: BoardOverviewProps) {
  const { total, done, overdue, dueToday, percentDone, priorityCounts } = useBoardStats(
    tasks,
    columns
  );

  if (total === 0) return null;

  return (
    <div className="flex flex-col gap-2 border-b border-border px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="font-mono">
            <span className="font-medium text-foreground">{done}</span>/{total} done
          </span>
          {overdue > 0 && (
            <Link
              href="/today"
              className="flex items-center gap-1 font-mono text-destructive hover:underline"
            >
              <AlertCircle className="h-3.5 w-3.5" />
              {overdue} overdue
            </Link>
          )}
          {dueToday > 0 && (
            <Link
              href="/today"
              className="flex items-center gap-1 font-mono text-primary hover:underline"
            >
              <CalendarClock className="h-3.5 w-3.5" />
              {dueToday} due today
            </Link>
          )}
        </div>
        <span className="font-mono text-xs font-medium text-muted-foreground">{percentDone}%</span>
      </div>

      <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-primary transition-all" style={{ width: `${percentDone}%` }} />
      </div>

      <div className="flex gap-1">
        {(["high", "medium", "low"] as const).map((priority) => {
          const width = (priorityCounts[priority] / total) * 100;
          if (width === 0) return null;
          return (
            <div
              key={priority}
              className={`h-1 rounded-full ${PRIORITY_COLOR[priority]}`}
              style={{ width: `${width}%` }}
            >
              <title>{`${priorityCounts[priority]} ${priority} priority`}</title>
            </div>
          );
        })}
      </div>
    </div>
  );
}