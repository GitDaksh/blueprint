import { z } from "zod";
import { readStorage, writeStorage } from "./local-storage";
import { STORAGE_KEYS } from "./keys";
import { generateId } from "@/lib/id";
import { snippetSchema, type Snippet } from "@/lib/schema";

function getAllSnippets(): Snippet[] {
  return readStorage<Snippet[]>(STORAGE_KEYS.snippets, []);
}

function saveAllSnippets(snippets: Snippet[]): void {
  writeStorage(STORAGE_KEYS.snippets, snippets);
}

export const snippetRepository = {
  async getAll(): Promise<Snippet[]> {
    return getAllSnippets().sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  },

  async create(
    input: Omit<z.input<typeof snippetSchema>, "id" | "createdAt" | "updatedAt">
  ): Promise<Snippet> {
    const now = new Date().toISOString();
    const snippet = snippetSchema.parse({
      ...input,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    });

    saveAllSnippets([...getAllSnippets(), snippet]);
    return snippet;
  },

  async update(id: string, updates: Partial<Snippet>): Promise<Snippet> {
    const snippets = getAllSnippets();
    const index = snippets.findIndex((s) => s.id === id);
    if (index === -1) throw new Error(`Snippet ${id} not found`);

    const updated = snippetSchema.parse({
      ...snippets[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    snippets[index] = updated;
    saveAllSnippets(snippets);
    return updated;
  },

  async remove(id: string): Promise<void> {
    saveAllSnippets(getAllSnippets().filter((s) => s.id !== id));
  },
};