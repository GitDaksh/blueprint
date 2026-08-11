import { boardRepository } from "./storage/board-repository";
import { columnRepository } from "./storage/column-repository";
import { taskRepository } from "./storage/task-repository";
import { generateId } from "./id";
import { journalEntrySchema, snippetSchema, focusSessionSchema } from "./schema";
import { writeStorage, readStorage } from "./storage/local-storage";
import { STORAGE_KEYS } from "./storage/keys";
import type { JournalEntry, Snippet, FocusSession } from "./schema";

function daysAgo(days: number, hour = 10): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
}

function dateOffset(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export async function loadSampleData(): Promise<void> {
  const board = await boardRepository.create("Sample Project");
  const todo = await columnRepository.create({ boardId: board.id, title: "To Do" });
  const inProgress = await columnRepository.create({ boardId: board.id, title: "In Progress" });
  const done = await columnRepository.create({ boardId: board.id, title: "Done" });

  const tasks: Array<{
    columnId: string;
    title: string;
    description?: string;
    priority: "low" | "medium" | "high";
    tags: string[];
    dueDate?: string;
  }> = [
    {
      columnId: todo.id,
      title: "Design onboarding illustrations",
      description: "Sketch a few options before picking a final style direction.",
      priority: "low",
      tags: ["design"],
    },
    {
      columnId: todo.id,
      title: "Research pricing page competitors",
      priority: "medium",
      tags: ["research"],
    },
    {
      columnId: todo.id,
      title: "Fix Safari flexbox bug on settings page",
      priority: "high",
      tags: ["bug", "frontend"],
      dueDate: dateOffset(-1),
    },
    {
      columnId: inProgress.id,
      title: "Build command palette search",
      description: "Wire up fuzzy search across tasks, notes, and snippets.",
      priority: "high",
      tags: ["feature", "frontend"],
      dueDate: dateOffset(0),
    },
    {
      columnId: inProgress.id,
      title: "Write API rate limiting middleware",
      priority: "medium",
      tags: ["backend"],
    },
    {
      columnId: done.id,
      title: "Set up CI pipeline",
      priority: "medium",
      tags: ["devops"],
    },
    {
      columnId: done.id,
      title: "Migrate to Tailwind v4",
      priority: "low",
      tags: ["frontend", "chore"],
    },
  ];

  for (const task of tasks) {
    await taskRepository.create({ boardId: board.id, ...task });
  }

  const journalEntries: JournalEntry[] = [
    journalEntrySchema.parse({
      id: generateId(),
      title: "Kicked off the redesign",
      content:
        "# Kicked off the redesign\n\nSpent today mapping out the new information architecture. Key decisions:\n\n- Move settings into its own section\n- Merge notifications into the activity feed\n- Ship the command palette before anything else\n\n```ts\nconst shipped = true;\n```\n\nFeeling good about the direction.",
      createdAt: daysAgo(4, 9),
      updatedAt: daysAgo(4, 9),
    }),
    journalEntrySchema.parse({
      id: generateId(),
      title: "Debugging the drag-and-drop",
      content:
        "Lost most of the afternoon to a flexbox sizing bug — turns out flex items default to `min-width: auto`, not `0`. Once I found that, the fix was trivial.\n\n**Lesson:** always reach for `min-w-0` earlier when nesting flex containers.",
      createdAt: daysAgo(2, 15),
      updatedAt: daysAgo(2, 15),
    }),
    journalEntrySchema.parse({
      id: generateId(),
      title: "Planning next sprint",
      content:
        "## Goals for next week\n\n1. Ship tags on tasks\n2. Add sample data for new users\n3. Start looking at the backend architecture\n\nNothing urgent, just want to keep momentum going.",
      createdAt: daysAgo(0, 11),
      updatedAt: daysAgo(0, 11),
    }),
  ];
  writeStorage(STORAGE_KEYS.journalEntries, [
    ...readStorage<JournalEntry[]>(STORAGE_KEYS.journalEntries, []),
    ...journalEntries,
  ]);

  const snippets: Snippet[] = [
    snippetSchema.parse({
      id: generateId(),
      title: "Debounce hook",
      language: "typescript",
      code: `import { useEffect, useState } from "react";\n\nexport function useDebouncedValue<T>(value: T, delayMs: number): T {\n  const [debounced, setDebounced] = useState(value);\n\n  useEffect(() => {\n    const timeout = setTimeout(() => setDebounced(value), delayMs);\n    return () => clearTimeout(timeout);\n  }, [value, delayMs]);\n\n  return debounced;\n}`,
      tags: ["react", "hooks"],
      createdAt: daysAgo(3, 13),
      updatedAt: daysAgo(3, 13),
    }),
    snippetSchema.parse({
      id: generateId(),
      title: "Binary search",
      language: "python",
      code: `def binary_search(arr, target):\n    lo, hi = 0, len(arr) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1`,
      tags: ["algorithms", "cp"],
      createdAt: daysAgo(6, 16),
      updatedAt: daysAgo(6, 16),
    }),
    snippetSchema.parse({
      id: generateId(),
      title: "Fetch with timeout",
      language: "javascript",
      code: `async function fetchWithTimeout(url, ms = 5000) {\n  const controller = new AbortController();\n  const timeout = setTimeout(() => controller.abort(), ms);\n\n  try {\n    return await fetch(url, { signal: controller.signal });\n  } finally {\n    clearTimeout(timeout);\n  }\n}`,
      tags: ["javascript", "networking"],
      createdAt: daysAgo(1, 10),
      updatedAt: daysAgo(1, 10),
    }),
  ];
  writeStorage(STORAGE_KEYS.snippets, [
    ...readStorage<Snippet[]>(STORAGE_KEYS.snippets, []),
    ...snippets,
  ]);

  const focusSessions: FocusSession[] = [0, 1, 2, 3, 4, 5, 6].map((day) =>
    focusSessionSchema.parse({
      id: generateId(),
      label: ["Deep work", "Bug fixing", "Code review", "Planning"][day % 4],
      durationSeconds: 25 * 60,
      completedAt: daysAgo(day, 9),
    })
  );
  writeStorage(STORAGE_KEYS.focusSessions, [
    ...readStorage<FocusSession[]>(STORAGE_KEYS.focusSessions, []),
    ...focusSessions,
  ]);
}