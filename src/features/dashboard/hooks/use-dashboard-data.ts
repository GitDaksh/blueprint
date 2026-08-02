"use client";

import { useCallback, useEffect, useState } from "react";
import { KanbanSquare, NotebookText, Code2, type LucideIcon } from "lucide-react";
import { boardRepository } from "@/lib/storage/board-repository";
import { columnRepository } from "@/lib/storage/column-repository";
import { taskRepository } from "@/lib/storage/task-repository";
import { journalRepository } from "@/lib/storage/journal-repository";
import { snippetRepository } from "@/lib/storage/snippet-repository";
import { focusSessionRepository } from "@/lib/storage/focus-session-repository";

interface ActivityItem {
  id: string;
  title: string;
  timestamp: string;
  href: string;
  icon: LucideIcon;
}

function computeStreak(completedDates: Set<string>): number {
  let streak = 0;
  const cursor = new Date();

  if (!completedDates.has(cursor.toDateString())) {
    cursor.setDate(cursor.getDate() - 1);
    if (!completedDates.has(cursor.toDateString())) return 0;
  }

  while (completedDates.has(cursor.toDateString())) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function useDashboardData() {
  const [isLoading, setIsLoading] = useState(true);
  const [doneCount, setDoneCount] = useState(0);
  const [focusMinutesToday, setFocusMinutesToday] = useState(0);
  const [streak, setStreak] = useState(0);
  const [snippetCount, setSnippetCount] = useState(0);
  const [weekSeries, setWeekSeries] = useState<{ label: string; value: number }[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);

  const refresh = useCallback(async () => {
    setIsLoading(true);

    const boards = await boardRepository.getAll();
    const boardTaskData = await Promise.all(
      boards.map(async (board) => {
        const [columns, tasks] = await Promise.all([
          columnRepository.getByBoard(board.id),
          taskRepository.getByBoard(board.id),
        ]);
        return { board, columns, tasks };
      })
    );

    let done = 0;
    const taskActivity: ActivityItem[] = [];

    for (const { board, columns, tasks } of boardTaskData) {
      const columnById = new Map(columns.map((c) => [c.id, c]));
      for (const task of tasks) {
        const columnTitle = columnById.get(task.columnId)?.title ?? "";
        if (columnTitle.toLowerCase() === "done") done++;

        taskActivity.push({
          id: `task-${task.id}`,
          title: task.title,
          timestamp: task.updatedAt,
          href: `/board/${board.id}?taskId=${task.id}`,
          icon: KanbanSquare,
        });
      }
    }
    setDoneCount(done);

    const [journalEntries, snippets, focusSessions] = await Promise.all([
      journalRepository.getAll(),
      snippetRepository.getAll(),
      focusSessionRepository.getAll(),
    ]);
    setSnippetCount(snippets.length);

    const todayKey = new Date().toDateString();
    const todaySeconds = focusSessions
      .filter((s) => new Date(s.completedAt).toDateString() === todayKey)
      .reduce((sum, s) => sum + s.durationSeconds, 0);
    setFocusMinutesToday(Math.round(todaySeconds / 60));

    const completedDates = new Set(
      focusSessions.map((s) => new Date(s.completedAt).toDateString())
    );
    setStreak(computeStreak(completedDates));

    const series = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const key = date.toDateString();
      const seconds = focusSessions
        .filter((s) => new Date(s.completedAt).toDateString() === key)
        .reduce((sum, s) => sum + s.durationSeconds, 0);
      return {
        label: date.toLocaleDateString(undefined, { weekday: "short" }).slice(0, 2),
        value: Math.round(seconds / 60),
      };
    });
    setWeekSeries(series);

    const activity = [
      ...taskActivity,
      ...journalEntries.map((entry) => ({
        id: `journal-${entry.id}`,
        title: entry.title,
        timestamp: entry.createdAt,
        href: `/journal/${entry.id}`,
        icon: NotebookText,
      })),
      ...snippets.map((snippet) => ({
        id: `snippet-${snippet.id}`,
        title: snippet.title,
        timestamp: snippet.updatedAt,
        href: `/snippets?snippetId=${snippet.id}`,
        icon: Code2,
      })),
    ]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 6);

    setRecentActivity(activity);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    isLoading,
    doneCount,
    focusMinutesToday,
    streak,
    snippetCount,
    weekSeries,
    recentActivity,
    refresh,
  };
}