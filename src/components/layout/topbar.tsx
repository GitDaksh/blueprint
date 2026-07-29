"use client";

import { Search } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useCommandMenu } from "@/components/command-menu-provider";

export function Topbar() {
  const { setOpen } = useCommandMenu();

  return (
    <header className="flex h-14 items-center justify-between gap-4 border-b border-border px-6">
      <button
        onClick={() => setOpen(true)}
        className="flex w-64 items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted"
      >
        <Search className="h-4 w-4" />
        Search…
        <kbd className="ml-auto rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px]">
          ⌘K
        </kbd>
      </button>
      <ThemeToggle />
    </header>
  );
}