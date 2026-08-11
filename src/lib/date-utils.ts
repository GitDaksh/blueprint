export function todayDateKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function dueDateStatus(dueDate: string): "overdue" | "today" | "upcoming" {
  const dueKey = dueDate.slice(0, 10);
  const key = todayDateKey();
  if (dueKey < key) return "overdue";
  if (dueKey === key) return "today";
  return "upcoming";
}