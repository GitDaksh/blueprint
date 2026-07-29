"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { boardRepository } from "@/lib/storage/board-repository";
import { getLastBoardId } from "@/lib/storage/preferences";
import { createBoardWithDefaultColumns } from "@/lib/board-seed";

export default function BoardIndexPage() {
  const router = useRouter();

  useEffect(() => {
    async function redirectToBoard() {
      const boards = await boardRepository.getAll();
      const lastBoardId = getLastBoardId();
      let target = boards.find((b) => b.id === lastBoardId) ?? boards[0];

      if (!target) {
        target = await createBoardWithDefaultColumns("My Board");
      }

      router.replace(`/board/${target.id}`);
    }

    redirectToBoard();
  }, [router]);

  return (
    <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
      Loading board…
    </div>
  );
}