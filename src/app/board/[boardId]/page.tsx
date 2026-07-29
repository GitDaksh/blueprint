"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { DragDropProvider } from "@dnd-kit/react";
import { PointerSensor, PointerActivationConstraints } from "@dnd-kit/dom";
import { move } from "@dnd-kit/helpers";
import { useBoard } from "@/features/board/hooks/use-board";
import { useBoardGroups } from "@/features/board/hooks/use-board-groups";
import { BoardColumn } from "@/features/board/components/board-column";
import { TaskDetailSheet } from "@/features/board/components/task-detail-sheet";
import { BoardSwitcher } from "@/features/board/components/board-switcher";
import type { Task } from "@/lib/schema";

export default function BoardPage() {
  const { boardId } = useParams<{ boardId: string }>();
  const { board, columns, tasks, isLoading, refresh } = useBoard(boardId);
  const { groups, setGroups, isDragging, snapshot, persist } = useBoardGroups(
    tasks,
    columns,
    refresh
  );
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
        Loading board…
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
    <div className="flex flex-1 flex-col overflow-hidden">
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
        <div className="flex flex-1 gap-4 overflow-x-auto p-6">
          {columns.map((column) => (
            <BoardColumn
              key={column.id}
              column={column}
              tasks={groups[column.id] ?? []}
              boardId={board.id}
              onTaskCreated={refresh}
              onTaskSelect={setSelectedTask}
            />
          ))}
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