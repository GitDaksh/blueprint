"use client";

import { Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { TaskForm, type TaskSubmitValues } from "./task-form";
import { taskRepository } from "@/lib/storage/task-repository";
import type { Task } from "@/lib/schema";

interface TaskDetailSheetProps {
  task: Task | null;
  onOpenChange: (open: boolean) => void;
  onUpdated: () => void;
}

export function TaskDetailSheet({ task, onOpenChange, onUpdated }: TaskDetailSheetProps) {
  async function handleUpdate(values: TaskSubmitValues) {
    if (!task) return;
    await taskRepository.update(task.id, values);
    onUpdated();
    onOpenChange(false);
  }

  async function handleDelete() {
    if (!task) return;
    await taskRepository.remove(task.id);
    onUpdated();
    onOpenChange(false);
  }

  return (
    <Sheet open={task !== null} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Task</SheetTitle>
          <SheetDescription>Update the task details or delete it.</SheetDescription>
        </SheetHeader>
        {task && (
          <div className="flex flex-col gap-6 px-4 pb-4">
            <TaskForm
              defaultValues={{
                title: task.title,
                description: task.description ?? "",
                priority: task.priority,
                dueDate: task.dueDate,
              }}
              defaultTags={task.tags}
              submitLabel="Save Changes"
              onSubmit={handleUpdate}
              onCancel={() => onOpenChange(false)}
            />

            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full text-destructive hover:text-destructive"
                  />
                }
              >
                <Trash2 className="h-4 w-4" />
                Delete Task
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this task?</AlertDialogTitle>
                  <AlertDialogDescription>
                    {`This action cannot be undone. This will permanently delete "${task.title}".`}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}