"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface ShortcutsHelpContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ShortcutsHelpContext = createContext<ShortcutsHelpContextValue | null>(null);

export function ShortcutsHelpProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <ShortcutsHelpContext.Provider value={{ open, setOpen }}>
      {children}
    </ShortcutsHelpContext.Provider>
  );
}

export function useShortcutsHelp() {
  const context = useContext(ShortcutsHelpContext);
  if (!context) {
    throw new Error("useShortcutsHelp must be used within a ShortcutsHelpProvider");
  }
  return context;
}