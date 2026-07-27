import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Task } from "@/lib/schema";

const priorityStyles: Record<Task["priority"], string> = {
  low: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  high: "bg-red-500/10 text-red-400 border-red-500/20",
};

export function TaskCard({ task }: { task: Task }) {
  return (
    <Card className="cursor-pointer gap-3 p-3 transition-colors hover:border-foreground/20">
      <CardContent className="p-0">
        <p className="text-sm font-medium leading-snug">{task.title}</p>
        <div className="mt-2 flex items-center gap-2">
          <Badge variant="outline" className={priorityStyles[task.priority]}>
            {task.priority}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}