"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SHORTCUTS } from "@/lib/shortcuts";
import { useShortcutsHelp } from "./shortcuts-help-provider";

function groupShortcuts() {
  const groups = new Map<string, typeof SHORTCUTS>();
  for (const shortcut of SHORTCUTS) {
    const list = groups.get(shortcut.group) ?? [];
    list.push(shortcut);
    groups.set(shortcut.group, list);
  }
  return groups;
}

export function ShortcutsHelpDialog() {
  const { open, setOpen } = useShortcutsHelp();
  const groups = groupShortcuts();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>Move around BluePrint without touching the mouse.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-5">
          {Array.from(groups.entries()).map(([group, shortcuts]) => (
            <div key={group}>
              <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {group}
              </h3>
              <div className="flex flex-col gap-2">
                {shortcuts.map((shortcut) => (
                  <div key={shortcut.id} className="flex items-center justify-between text-sm">
                    <span>{shortcut.description}</span>
                    <div className="flex gap-1">
                      {shortcut.keys.map((key) => (
                        <kbd
                          key={key}
                          className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}