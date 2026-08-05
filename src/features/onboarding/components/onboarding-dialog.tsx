"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { KanbanSquare, NotebookText, Command } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { setHasOnboarded } from "@/lib/storage/preferences";

const STEPS = [
  {
    icon: KanbanSquare,
    title: "Organize with boards",
    description:
      "Create kanban boards for each project. Drag tasks between columns, add details, and keep everything moving.",
  },
  {
    icon: NotebookText,
    title: "Journal & snippets",
    description:
      "Keep a markdown dev journal and a searchable library of code snippets — all in one place, right alongside your tasks.",
  },
  {
    icon: Command,
    title: "Built for the keyboard",
    description:
      "Press ⌘K anytime to jump to any board, task, or note. Press ? to see every shortcut BluePrint offers.",
  },
];

interface OnboardingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OnboardingDialog({ open, onOpenChange }: OnboardingDialogProps) {
  const [step, setStep] = useState(0);
  const isLastStep = step === STEPS.length - 1;
  const current = STEPS[step];

  function finish() {
    setHasOnboarded();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !next && finish()}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <div className="flex flex-col items-center gap-6 py-4 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <current.icon className="h-6 w-6" />
              </div>
              <h2 className="font-heading text-lg font-semibold">{current.title}</h2>
              <p className="max-w-xs text-sm text-muted-foreground">{current.description}</p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-1.5">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? "w-6 bg-primary" : "w-1.5 bg-muted"
                }`}
              />
            ))}
          </div>

          <div className="flex w-full gap-2">
            <Button variant="ghost" className="flex-1" onClick={finish}>
              Skip
            </Button>
            <Button
              className="flex-1"
              onClick={() => (isLastStep ? finish() : setStep((s) => s + 1))}
            >
              {isLastStep ? "Get Started" : "Next"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}