"use client";

import { useCallback, useEffect, useState } from "react";
import { journalRepository } from "@/lib/storage/journal-repository";
import type { JournalEntry } from "@/lib/schema";

export function useJournalEntry(entryId: string) {
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setEntry(await journalRepository.getById(entryId));
    setIsLoading(false);
  }, [entryId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { entry, isLoading, refresh };
}