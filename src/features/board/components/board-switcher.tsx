"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useBoardList } from "@/features/board/hooks/use-board-list";
import { CreateBoardDialog } from "./create-board-dialog";
import type { Board } from "@/lib/schema";

interface BoardSwitcherProps {
  activeBoard: Board;
}

export function BoardSwitcher({ activeBoard }: BoardSwitcherProps) {
  const router = useRouter();
  const { boards, refresh } = useBoardList();
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" className="gap-2 px-2 text-lg font-semibold" />}
        >
          <span className="font-heading">{activeBoard.name}</span>
          <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {boards.map((board) => (
            <DropdownMenuItem key={board.id} onClick={() => router.push(`/board/${board.id}`)}>
              <span className="w-4">
                {board.id === activeBoard.id && <Check className="h-4 w-4" />}
              </span>
              {board.name}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            New Board
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateBoardDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={async (board) => {
          await refresh();
          router.push(`/board/${board.id}`);
        }}
      />
    </>
  );
}