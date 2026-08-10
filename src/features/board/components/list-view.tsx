"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { priorityStyles } from "@/lib/priority-styles";
import type { Column, Task } from "@/lib/schema";

type SortKey = "title" | "priority" | "column";

const PRIORITY_WEIGHT: Record<Task["priority"], number> = { low: 0, medium: 1, high: 2 };

interface ListViewProps {
  tasks: Task[];
  columns: Column[];
  onTaskSelect: (task: Task) => void;
}

export function ListView({ tasks, columns, onTaskSelect }: ListViewProps) {
  const [sortKey, setSortKey] = useState<SortKey>("column");
  const [sortAsc, setSortAsc] = useState(true);

  const columnTitleById = useMemo(() => new Map(columns.map((c) => [c.id, c.title])), [columns]);

  const sorted = useMemo(() => {
    const withColumn = tasks.map((task) => ({
      task,
      columnTitle: columnTitleById.get(task.columnId) ?? "",
    }));

    withColumn.sort((a, b) => {
      let diff = 0;
      if (sortKey === "title") diff = a.task.title.localeCompare(b.task.title);
      if (sortKey === "priority")
        diff = PRIORITY_WEIGHT[a.task.priority] - PRIORITY_WEIGHT[b.task.priority];
      if (sortKey === "column") diff = a.columnTitle.localeCompare(b.columnTitle);
      return sortAsc ? diff : -diff;
    });

    return withColumn;
  }, [tasks, sortKey, sortAsc, columnTitleById]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortAsc((asc) => !asc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  function SortableHead({ label, sortKeyValue }: { label: string; sortKeyValue: SortKey }) {
    return (
      <TableHead>
        <button
          onClick={() => toggleSort(sortKeyValue)}
          className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          {label}
          <ArrowUpDown className="h-3 w-3" />
        </button>
      </TableHead>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 text-sm text-muted-foreground">
        No tasks on this board yet.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <SortableHead label="Title" sortKeyValue="title" />
            <SortableHead label="Column" sortKeyValue="column" />
            <SortableHead label="Priority" sortKeyValue="priority" />
            <TableHead className="text-xs font-medium text-muted-foreground">Tags</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map(({ task, columnTitle }) => (
            <TableRow key={task.id} onClick={() => onTaskSelect(task)} className="cursor-pointer">
              <TableCell className="font-medium">{task.title}</TableCell>
              <TableCell className="text-muted-foreground">{columnTitle}</TableCell>
              <TableCell>
                <Badge variant="outline" className={priorityStyles[task.priority]}>
                  {task.priority}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {task.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}