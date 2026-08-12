import { useMemo } from "react";
import { todayDateKey } from "@/lib/date-utils";
import type { Column, Task } from "@/lib/schema";

export function useBoardStats(tasks: Task[], columns: Column[]) {
  return useMemo(() => {
    const doneColumnIds = new Set(
      columns.filter((c) => c.title.toLowerCase() === "done").map((c) => c.id)
    );
    const total = tasks.length;
    const done = tasks.filter((t) => doneColumnIds.has(t.columnId)).length;
    const key = todayDateKey();
    const overdue = tasks.filter(
      (t) => t.dueDate && t.dueDate.slice(0, 10) < key && !doneColumnIds.has(t.columnId)
    ).length;
    const dueToday = tasks.filter(
      (t) => t.dueDate && t.dueDate.slice(0, 10) === key && !doneColumnIds.has(t.columnId)
    ).length;
    const percentDone = total === 0 ? 0 : Math.round((done / total) * 100);

    const priorityCounts: Record<Task["priority"], number> = { low: 0, medium: 0, high: 0 };
    for (const t of tasks) priorityCounts[t.priority]++;

    return { total, done, overdue, dueToday, percentDone, priorityCounts };
  }, [tasks, columns]);
}