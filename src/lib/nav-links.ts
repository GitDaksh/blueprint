import { LayoutDashboard, KanbanSquare, NotebookText, Code2, Settings } from "lucide-react";

export const navLinks = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Board", href: "/board", icon: KanbanSquare },
  { label: "Journal", href: "/journal", icon: NotebookText },
  { label: "Snippets", href: "/snippets", icon: Code2 },
];

export const secondaryNavLinks = [{ label: "Settings", href: "/settings", icon: Settings }];

export function isNavLinkActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}