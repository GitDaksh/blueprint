"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useShortcutsHelp } from "./shortcuts-help-provider";

const SEQUENCE_TIMEOUT_MS = 800;

export function GlobalShortcuts() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const { setOpen: setHelpOpen } = useShortcutsHelp();

  const pendingKey = useRef<string | null>(null);
  const pendingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function isTypingTarget(target: EventTarget | null) {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName;
      return tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable;
    }

    function clearPending() {
      pendingKey.current = null;
      if (pendingTimeout.current) clearTimeout(pendingTimeout.current);
      pendingTimeout.current = null;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (isTypingTarget(event.target)) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const key = event.key.toLowerCase();

      if (pendingKey.current === "g") {
        clearPending();
        const destinations: Record<string, string> = {
          d: "/",
          b: "/board",
          j: "/journal",
          s: "/snippets",
        };
        const href = destinations[key];
        if (href) {
          event.preventDefault();
          router.push(href);
        }
        return;
      }

      if (key === "g") {
        pendingKey.current = "g";
        pendingTimeout.current = setTimeout(clearPending, SEQUENCE_TIMEOUT_MS);
        return;
      }

      if (key === "?") {
        event.preventDefault();
        setHelpOpen(true);
        return;
      }

      if (key === "t") {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
        return;
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      clearPending();
    };
  }, [router, resolvedTheme, setTheme, setHelpOpen]);

  return null;
}