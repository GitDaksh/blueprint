"use client";

import { useCallback, useEffect, useState } from "react";
import { journalRepository } from "@/lib/storage/journal-repository";
import type { JournalEntry } from "@/lib/schema";

export function useJournalEntries() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setEntries(await journalRepository.getAll());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { entries, isLoading, refresh };
}