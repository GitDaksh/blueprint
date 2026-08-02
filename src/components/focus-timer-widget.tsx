"use client";

import { useState } from "react";
import { Pause, Play, RotateCcw, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useFocusTimer } from "@/components/focus-timer-provider";

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function FocusTimerWidget() {
  const { phase, secondsLeft, isRunning, label, setLabel, start, pause, resume, reset } =
    useFocusTimer();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={<Button variant="outline" size="sm" className="gap-2 font-mono" />}
      >
        <Timer className="h-4 w-4" />
        {phase === "idle" ? "Focus" : formatTime(secondsLeft)}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72">
        <div className="flex flex-col gap-4">
          <div className="text-center">
            <p className="font-mono text-3xl font-semibold">{formatTime(secondsLeft)}</p>
            <p className="text-xs text-muted-foreground">
              {phase === "focus"
                ? "Focus session"
                : phase === "break"
                  ? "Break"
                  : "Ready to focus"}
            </p>
          </div>

          {phase === "idle" && (
            <Input
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              placeholder="What are you focusing on?"
            />
          )}

          <div className="flex justify-center gap-2">
            {phase === "idle" ? (
              <Button onClick={start} className="flex-1">
                <Play className="h-4 w-4" />
                Start Focus
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={isRunning ? pause : resume} className="flex-1">
                  {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isRunning ? "Pause" : "Resume"}
                </Button>
                <Button variant="ghost" onClick={reset}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}