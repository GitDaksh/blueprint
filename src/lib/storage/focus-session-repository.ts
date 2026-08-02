import { readStorage, writeStorage } from "./local-storage";
import { STORAGE_KEYS } from "./keys";
import { generateId } from "@/lib/id";
import { focusSessionSchema, type FocusSession } from "@/lib/schema";

function getAllSessions(): FocusSession[] {
  return readStorage<FocusSession[]>(STORAGE_KEYS.focusSessions, []);
}

function saveAllSessions(sessions: FocusSession[]): void {
  writeStorage(STORAGE_KEYS.focusSessions, sessions);
}

export const focusSessionRepository = {
  async getAll(): Promise<FocusSession[]> {
    return getAllSessions().sort(
      (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );
  },

  async create(input: Omit<FocusSession, "id" | "completedAt">): Promise<FocusSession> {
    const session = focusSessionSchema.parse({
      ...input,
      id: generateId(),
      completedAt: new Date().toISOString(),
    });

    saveAllSessions([...getAllSessions(), session]);
    return session;
  },
};