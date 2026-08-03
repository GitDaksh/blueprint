"use client";

import { Search, Keyboard } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { FocusTimerWidget } from "@/components/focus-timer-widget";
import { Button } from "@/components/ui/button";
import { useCommandMenu } from "@/components/command-menu-provider";
import { useShortcutsHelp } from "@/components/shortcuts-help-provider";

export function Topbar() {
  const { setOpen } = useCommandMenu();
  const { setOpen: setHelpOpen } = useShortcutsHelp();

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
      <div className="flex items-center gap-2">
        <FocusTimerWidget />
        <Button
          variant="ghost"
          size="icon"
          aria-label="Keyboard shortcuts"
          onClick={() => setHelpOpen(true)}
        >
          <Keyboard className="h-4 w-4" />
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}