"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { focusSessionRepository } from "@/lib/storage/focus-session-repository";

const FOCUS_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;

type Phase = "idle" | "focus" | "break";

interface FocusTimerContextValue {
  phase: Phase;
  secondsLeft: number;
  isRunning: boolean;
  label: string;
  setLabel: (label: string) => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
}

const FocusTimerContext = createContext<FocusTimerContextValue | null>(null);

export function FocusTimerProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [label, setLabel] = useState("");

  const labelRef = useRef(label);
  labelRef.current = label;

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSecondsLeft((current) => {
        if (current > 1) return current - 1;

        if (phase === "focus") {
          void focusSessionRepository.create({
            label: labelRef.current || undefined,
            durationSeconds: FOCUS_SECONDS,
          });
          setPhase("break");
          return BREAK_SECONDS;
        }

        setPhase("idle");
        setIsRunning(false);
        return 0;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, phase]);

  function start() {
    setPhase("focus");
    setSecondsLeft(FOCUS_SECONDS);
    setIsRunning(true);
  }

  function pause() {
    setIsRunning(false);
  }

  function resume() {
    if (phase !== "idle") setIsRunning(true);
  }

  function reset() {
    setPhase("idle");
    setSecondsLeft(0);
    setIsRunning(false);
  }

  return (
    <FocusTimerContext.Provider
      value={{ phase, secondsLeft, isRunning, label, setLabel, start, pause, resume, reset }}
    >
      {children}
    </FocusTimerContext.Provider>
  );
}

export function useFocusTimer() {
  const context = useContext(FocusTimerContext);
  if (!context) {
    throw new Error("useFocusTimer must be used within a FocusTimerProvider");
  }
  return context;
}