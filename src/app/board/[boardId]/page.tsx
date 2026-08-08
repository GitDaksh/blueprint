"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { DragDropProvider } from "@dnd-kit/react";
import { PointerSensor, PointerActivationConstraints } from "@dnd-kit/dom";
import { move } from "@dnd-kit/helpers";
import { useBoard } from "@/features/board/hooks/use-board";
import { useBoardGroups } from "@/features/board/hooks/use-board-groups";
import { BoardColumn } from "@/features/board/components/board-column";
import { TaskDetailSheet } from "@/features/board/components/task-detail-sheet";
import { BoardSwitcher } from "@/features/board/components/board-switcher";
import { AddColumnButton } from "@/features/board/components/add-column-button";
import type { Task } from "@/lib/schema";
import { Skeleton } from "@/components/ui/skeleton";

function BoardPageContent() {
  const { boardId } = useParams<{ boardId: string }>();
  const searchParams = useSearchParams();
  const deepLinkedTaskId = searchParams.get("taskId");

  const { board, columns, tasks, isLoading, refresh } = useBoard(boardId);
  const { groups, setGroups, isDragging, snapshot, persist } = useBoardGroups(
    tasks,
    columns,
    refresh
  );
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    if (!deepLinkedTaskId || tasks.length === 0) return;
    const match = tasks.find((task) => task.id === deepLinkedTaskId);
    if (match) setSelectedTask(match);
  }, [deepLinkedTaskId, tasks]);

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="border-b border-border px-4 py-2">
          <Skeleton className="h-8 w-40" />
        </div>
        <div className="flex flex-1 flex-wrap content-start gap-4 p-6">
          {[0, 1, 2].map((col) => (
            <div key={col} className="flex w-72 shrink-0 flex-col gap-2 rounded-lg bg-muted/40 p-3">
              <Skeleton className="mb-2 h-4 w-20" />
              <Skeleton className="h-16 w-full rounded-md" />
              <Skeleton className="h-16 w-full rounded-md" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
        <p>Board not found.</p>
        <Link href="/board" className="text-foreground underline underline-offset-4">
          Go to your boards
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="border-b border-border px-4 py-2">
        <BoardSwitcher activeBoard={board} />
      </div>
      <DragDropProvider
        sensors={(defaults) => [
          ...defaults.filter((sensor) => sensor !== PointerSensor),
          PointerSensor.configure({
            activationConstraints: [new PointerActivationConstraints.Distance({ value: 6 })],
          }),
        ]}
        onDragStart={() => {
          isDragging.current = true;
          snapshot.current = groups;
        }}
        onDragOver={(event) => {
          setGroups((current) => move(current, event));
        }}
        onDragEnd={(event) => {
          isDragging.current = false;

          if (event.canceled) {
            setGroups(snapshot.current);
            return;
          }

          setGroups((current) => {
            const next = move(current, event);
            void persist(next);
            return next;
          });
        }}
      >
        <div className="flex flex-1 flex-wrap content-start gap-4 p-6">
          {columns.map((column) => (
            <BoardColumn
              key={column.id}
              column={column}
              tasks={groups[column.id] ?? []}
              boardId={board.id}
              canDelete={columns.length > 1}
              onTaskCreated={refresh}
              onTaskSelect={setSelectedTask}
              onColumnChanged={refresh}
            />
          ))}
          <AddColumnButton boardId={board.id} onCreated={refresh} />
        </div>
      </DragDropProvider>
      <TaskDetailSheet
        task={selectedTask}
        onOpenChange={(open) => {
          if (!open) setSelectedTask(null);
        }}
        onUpdated={refresh}
      />
    </div>
  );
}

export default function BoardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          Loading board…
        </div>
      }
    >
      <BoardPageContent />
    </Suspense>
  );
}