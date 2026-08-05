import { readStorage, writeStorage } from "./local-storage";
import { STORAGE_KEYS } from "./keys";

export function getLastBoardId(): string | null {
  return readStorage<string | null>(STORAGE_KEYS.lastBoardId, null);
}

export function setLastBoardId(boardId: string): void {
  writeStorage(STORAGE_KEYS.lastBoardId, boardId);
}

export function hasOnboarded(): boolean {
  return readStorage<boolean>(STORAGE_KEYS.hasOnboarded, false);
}

export function setHasOnboarded(): void {
  writeStorage(STORAGE_KEYS.hasOnboarded, true);
}