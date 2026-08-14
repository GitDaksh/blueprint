"use client";

import Link from "next/link";
import { AlertCircle, CalendarCheck, Sun } from "lucide-react";
import { useTodayTasks } from "@/features/today/hooks/use-today-tasks";

export function TodayGlance() {
  const { overdue, dueToday, isLoading } = useTodayTasks();

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  const isEmpty = overdue.length === 0 && dueToday.length === 0;

  return (
    <Link href="/today" className="flex flex-col gap-3">
      {isEmpty ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sun className="h-4 w-4" />
          Nothing due today or overdue
        </div>
      ) : (
        <>
          {overdue.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span className="font-mono font-medium">{overdue.length}</span> overdue
            </div>
          )}
          {dueToday.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-primary">
              <CalendarCheck className="h-4 w-4" />
              <span className="font-mono font-medium">{dueToday.length}</span> due today
            </div>
          )}
        </>
      )}
    </Link>
  );
}