import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarClock } from "lucide-react";
import { priorityStyles } from "@/lib/priority-styles";
import { dueDateStatus } from "@/lib/date-utils";
import { CornerMarks } from "@/components/corner-marks";
import type { Task } from "@/lib/schema";

const dueDateStyles: Record<"overdue" | "today" | "upcoming", string> = {
  overdue: "bg-red-500/10 text-red-400 border-red-500/20",
  today: "bg-primary/10 text-primary border-primary/20",
  upcoming: "bg-muted text-muted-foreground border-transparent",
};

export function TaskCard({ task }: { task: Task }) {
  return (
    <Card className="group relative cursor-pointer gap-3 p-3 transition-colors hover:border-primary/40">
      <CornerMarks className="opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
      <CardContent className="p-0">
        <p className="text-sm font-medium leading-snug">{task.title}</p>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <Badge variant="outline" className={priorityStyles[task.priority]}>
            {task.priority}
          </Badge>
          {task.dueDate && (
            <Badge variant="outline" className={dueDateStyles[dueDateStatus(task.dueDate)]}>
              <CalendarClock className="h-3 w-3" />
              {new Date(task.dueDate).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </Badge>
          )}
          {task.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}