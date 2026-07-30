import { z } from "zod";
import { readStorage, writeStorage } from "./local-storage";
import { STORAGE_KEYS } from "./keys";
import { generateId } from "@/lib/id";
import { journalEntrySchema, type JournalEntry } from "@/lib/schema";

function getAllEntries(): JournalEntry[] {
  return readStorage<JournalEntry[]>(STORAGE_KEYS.journalEntries, []);
}

function saveAllEntries(entries: JournalEntry[]): void {
  writeStorage(STORAGE_KEYS.journalEntries, entries);
}

export const journalRepository = {
  async getAll(): Promise<JournalEntry[]> {
    return getAllEntries().sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async getById(id: string): Promise<JournalEntry | null> {
    return getAllEntries().find((entry) => entry.id === id) ?? null;
  },

  async create(
    input: Omit<z.input<typeof journalEntrySchema>, "id" | "createdAt" | "updatedAt">
  ): Promise<JournalEntry> {
    const now = new Date().toISOString();
    const entry = journalEntrySchema.parse({
      ...input,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    });

    saveAllEntries([...getAllEntries(), entry]);
    return entry;
  },

  async update(id: string, updates: Partial<JournalEntry>): Promise<JournalEntry> {
    const entries = getAllEntries();
    const index = entries.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error(`Journal entry ${id} not found`);

    const updated = journalEntrySchema.parse({
      ...entries[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    entries[index] = updated;
    saveAllEntries(entries);
    return updated;
  },

  async remove(id: string): Promise<void> {
    saveAllEntries(getAllEntries().filter((entry) => entry.id !== id));
  },
};