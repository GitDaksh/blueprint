"use client";

import { useCallback, useEffect, useState } from "react";
import { snippetRepository } from "@/lib/storage/snippet-repository";
import type { Snippet } from "@/lib/schema";

export function useSnippets() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setSnippets(await snippetRepository.getAll());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { snippets, isLoading, refresh };
}