import { z } from "zod";
import {
  boardSchema,
  columnSchema,
  taskSchema,
  journalEntrySchema,
  snippetSchema,
  focusSessionSchema,
} from "@/lib/schema";
import { boardRepository } from "./storage/board-repository";
import { columnRepository } from "./storage/column-repository";
import { taskRepository } from "./storage/task-repository";
import { journalRepository } from "./storage/journal-repository";
import { snippetRepository } from "./storage/snippet-repository";
import { focusSessionRepository } from "./storage/focus-session-repository";
import { writeStorage } from "./storage/local-storage";
import { STORAGE_KEYS } from "./storage/keys";

const EXPORT_VERSION = 1;

const exportSchema = z.object({
  version: z.number(),
  exportedAt: z.string(),
  boards: z.array(boardSchema),
  columns: z.array(columnSchema),
  tasks: z.array(taskSchema),
  journalEntries: z.array(journalEntrySchema),
  snippets: z.array(snippetSchema),
  focusSessions: z.array(focusSessionSchema),
});
export type ExportedData = z.infer<typeof exportSchema>;

export async function exportAllData(): Promise<ExportedData> {
  const [boards, columns, tasks, journalEntries, snippets, focusSessions] = await Promise.all([
    boardRepository.getAll(),
    columnRepository.getAll(),
    taskRepository.getAll(),
    journalRepository.getAll(),
    snippetRepository.getAll(),
    focusSessionRepository.getAll(),
  ]);

  return {
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    boards,
    columns,
    tasks,
    journalEntries,
    snippets,
    focusSessions,
  };
}

export function downloadExport(data: ExportedData) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `blueprint-backup-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export function parseImportFile(raw: string): ExportedData {
  const json = JSON.parse(raw);
  return exportSchema.parse(json);
}

export function restoreAllData(data: ExportedData) {
  writeStorage(STORAGE_KEYS.boards, data.boards);
  writeStorage(STORAGE_KEYS.columns, data.columns);
  writeStorage(STORAGE_KEYS.tasks, data.tasks);
  writeStorage(STORAGE_KEYS.journalEntries, data.journalEntries);
  writeStorage(STORAGE_KEYS.snippets, data.snippets);
  writeStorage(STORAGE_KEYS.focusSessions, data.focusSessions);
}

export function resetAllData() {
  Object.values(STORAGE_KEYS).forEach((key) => {
    window.localStorage.removeItem(key);
  });
}