"use client";

import { useCallback, useEffect, useState } from "react";
import { taskRepository } from "@/lib/storage/task-repository";
import { journalRepository } from "@/lib/storage/journal-repository";
import { snippetRepository } from "@/lib/storage/snippet-repository";
import { focusSessionRepository } from "@/lib/storage/focus-session-repository";

export interface HeatmapDay {
  date: string;
  count: number;
}

const WEEKS = 16;
const DAYS = WEEKS * 7;

function dayKey(iso: string): string {
  return new Date(iso).toDateString();
}

export function useActivityHeatmap() {
  const [days, setDays] = useState<HeatmapDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);

    const [tasks, journalEntries, snippets, focusSessions] = await Promise.all([
      taskRepository.getAll(),
      journalRepository.getAll(),
      snippetRepository.getAll(),
      focusSessionRepository.getAll(),
    ]);

    const counts = new Map<string, number>();
    function bump(iso: string) {
      const key = dayKey(iso);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    tasks.forEach((t) => {
      bump(t.createdAt);
      if (t.updatedAt !== t.createdAt) bump(t.updatedAt);
    });
    journalEntries.forEach((e) => bump(e.createdAt));
    snippets.forEach((s) => {
      bump(s.createdAt);
      if (s.updatedAt !== s.createdAt) bump(s.updatedAt);
    });
    focusSessions.forEach((f) => bump(f.completedAt));

    const result: HeatmapDay[] = [];
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);

    for (let i = DAYS - 1; i >= 0; i--) {
      const date = new Date(cursor);
      date.setDate(date.getDate() - i);
      result.push({ date: date.toISOString(), count: counts.get(date.toDateString()) ?? 0 });
    }

    setDays(result);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { days, isLoading, refresh };
}