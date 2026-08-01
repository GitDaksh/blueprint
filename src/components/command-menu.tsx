"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Plus, KanbanSquare, NotebookText, Code2 } from "lucide-react";
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
import { taskRepository } from "@/lib/storage/task-repository";
import { journalRepository } from "@/lib/storage/journal-repository";
import { snippetRepository } from "@/lib/storage/snippet-repository";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useCommandMenu } from "./command-menu-provider";
import type { Task, JournalEntry, Snippet } from "@/lib/schema";

export function CommandMenu() {
  const { open, setOpen } = useCommandMenu();
  const router = useRouter();
  const { boards, refresh } = useBoardList();

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 200);

  const [taskResults, setTaskResults] = useState<Task[]>([]);
  const [journalResults, setJournalResults] = useState<JournalEntry[]>([]);
  const [snippetResults, setSnippetResults] = useState<Snippet[]>([]);

  useEffect(() => {
    async function runSearch() {
      if (!debouncedQuery.trim()) {
        setTaskResults([]);
        setJournalResults([]);
        setSnippetResults([]);
        return;
      }

      const [tasks, entries, snippets] = await Promise.all([
        taskRepository.search(debouncedQuery),
        journalRepository.search(debouncedQuery),
        snippetRepository.search(debouncedQuery),
      ]);

      setTaskResults(tasks);
      setJournalResults(entries);
      setSnippetResults(snippets);
    }

    runSearch();
  }, [debouncedQuery]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  function runCommand(action: () => void) {
    setOpen(false);
    action();
  }

  const q = query.trim().toLowerCase();
  const filteredNavLinks = navLinks.filter((link) => link.label.toLowerCase().includes(q));
  const filteredBoards = boards.filter((board) => board.name.toLowerCase().includes(q));

  return (
    <CommandDialog open={open} onOpenChange={setOpen} shouldFilter={false}>
      <CommandInput
        value={query}
        onValueChange={setQuery}
        placeholder="Type a command or search…"
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {filteredNavLinks.length > 0 && (
          <CommandGroup heading="Navigation">
            {filteredNavLinks.map((link) => (
              <CommandItem
                key={link.href}
                value={link.href}
                onSelect={() => runCommand(() => router.push(link.href))}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {filteredBoards.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Boards">
              {filteredBoards.map((board) => (
                <CommandItem
                  key={board.id}
                  value={board.id}
                  onSelect={() => runCommand(() => router.push(`/board/${board.id}`))}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  {board.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {taskResults.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Tasks">
              {taskResults.map((task) => (
                <CommandItem
                  key={task.id}
                  value={task.id}
                  onSelect={() =>
                    runCommand(() => router.push(`/board/${task.boardId}?taskId=${task.id}`))
                  }
                >
                  <KanbanSquare className="h-4 w-4" />
                  {task.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {journalResults.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Journal">
              {journalResults.map((entry) => (
                <CommandItem
                  key={entry.id}
                  value={entry.id}
                  onSelect={() => runCommand(() => router.push(`/journal/${entry.id}`))}
                >
                  <NotebookText className="h-4 w-4" />
                  {entry.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {snippetResults.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Snippets">
              {snippetResults.map((snippet) => (
                <CommandItem
                  key={snippet.id}
                  value={snippet.id}
                  onSelect={() =>
                    runCommand(() => router.push(`/snippets?snippetId=${snippet.id}`))
                  }
                >
                  <Code2 className="h-4 w-4" />
                  {snippet.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem
            value="create-new-board"
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