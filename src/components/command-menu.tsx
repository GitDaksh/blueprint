"use client";

import { useRouter } from "next/navigation";
import { LayoutDashboard, Plus } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { navLinks } from "@/lib/nav-links";
import { useBoardList } from "@/features/board/hooks/use-board-list";
import { createBoardWithDefaultColumns } from "@/lib/board-seed";
import { useCommandMenu } from "./command-menu-provider";

export function CommandMenu() {
  const { open, setOpen } = useCommandMenu();
  const router = useRouter();
  const { boards, refresh } = useBoardList();

  function runCommand(action: () => void) {
    setOpen(false);
    action();
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          {navLinks.map((link) => (
            <CommandItem
              key={link.href}
              value={link.label}
              onSelect={() => runCommand(() => router.push(link.href))}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </CommandItem>
          ))}
        </CommandGroup>

        {boards.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Boards">
              {boards.map((board) => (
                <CommandItem
                  key={board.id}
                  value={board.name}
                  onSelect={() => runCommand(() => router.push(`/board/${board.id}`))}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  {board.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem
            value="Create new board"
            onSelect={() =>
              runCommand(async () => {
                const board = await createBoardWithDefaultColumns("Untitled Board");
                await refresh();
                router.push(`/board/${board.id}`);
              })
            }
          >
            <Plus className="h-4 w-4" />
            Create New Board
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}