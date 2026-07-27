"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TaskForm } from "./task-form";
import { taskRepository } from "@/lib/storage/task-repository";
import type { TaskFormValues } from "@/lib/schema";

interface CreateTaskDialogProps {
  boardId: string;
  columnId: string;
  onCreated: () => void;
}

export function CreateTaskDialog({ boardId, columnId, onCreated }: CreateTaskDialogProps) {
  const [open, setOpen] = useState(false);

  async function handleSubmit(values: TaskFormValues) {
    await taskRepository.create({ ...values, boardId, columnId });
    setOpen(false);
    onCreated();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground" />
        }
      >
        <Plus className="h-4 w-4" />
        Add task
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Task</DialogTitle>
        </DialogHeader>
        <TaskForm onSubmit={handleSubmit} onCancel={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}