import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { priorityStyles } from "@/lib/priority-styles";
import type { Task } from "@/lib/schema";

export function TaskCard({ task }: { task: Task }) {
  return (
    <Card className="cursor-pointer gap-3 p-3 transition-colors hover:border-foreground/20">
      <CardContent className="p-0">
        <p className="text-sm font-medium leading-snug">{task.title}</p>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <Badge variant="outline" className={priorityStyles[task.priority]}>
            {task.priority}
          </Badge>
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