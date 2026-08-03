export interface ShortcutDef {
  id: string;
  keys: string[];
  description: string;
  group: "General" | "Navigation";
}

export const SHORTCUTS: ShortcutDef[] = [
  { id: "command-palette", keys: ["⌘", "K"], description: "Open command palette", group: "General" },
  { id: "shortcuts-help", keys: ["?"], description: "Show this help", group: "General" },
  { id: "toggle-theme", keys: ["T"], description: "Toggle dark / light mode", group: "General" },
  { id: "go-dashboard", keys: ["G", "D"], description: "Go to Dashboard", group: "Navigation" },
  { id: "go-board", keys: ["G", "B"], description: "Go to Board", group: "Navigation" },
  { id: "go-journal", keys: ["G", "J"], description: "Go to Journal", group: "Navigation" },
  { id: "go-snippets", keys: ["G", "S"], description: "Go to Snippets", group: "Navigation" },
];