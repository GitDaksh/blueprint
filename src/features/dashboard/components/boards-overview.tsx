"use client";

import Link from "next/link";
import { CornerMarks } from "@/components/corner-marks";
import type { BoardSummary } from "../hooks/use-dashboard-data";

export function BoardsOverview({ boards }: { boards: BoardSummary[] }) {
  if (boards.length === 0) {
    return <p className="text-sm text-muted-foreground">No boards yet.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {boards.map((board) => (
        <Link
          key={board.id}
          href={`/board/${board.id}`}
          className="group relative flex flex-col gap-1.5 rounded-md border border-border p-3 transition-colors hover:border-primary/40 hover:bg-muted/50"
        >
          <CornerMarks className="opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium">{board.name}</span>
            <span className="font-mono text-xs text-muted-foreground">
              {board.done}/{board.total}
            </span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${board.percentDone}%` }}
            />
          </div>
        </Link>
      ))}
    </div>
  );
}