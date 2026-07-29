"use client";

import { useCallback, useEffect, useState } from "react";
import { boardRepository } from "@/lib/storage/board-repository";
import type { Board } from "@/lib/schema";

export function useBoardList() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setBoards(await boardRepository.getAll());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { boards, isLoading, refresh };
}