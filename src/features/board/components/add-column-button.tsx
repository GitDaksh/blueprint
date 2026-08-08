"use client";

import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { columnRepository } from "@/lib/storage/column-repository";

interface AddColumnButtonProps {
  boardId: string;
  onCreated: () => void;
}

export function AddColumnButton({ boardId, onCreated }: AddColumnButtonProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    await columnRepository.create({ boardId, title: trimmed });
    setTitle("");
    setOpen(false);
    onCreated();
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className="h-fit w-72 shrink-0 justify-start gap-2 border-dashed text-muted-foreground"
          />
        }
      >
        <Plus className="h-4 w-4" />
        Add Column
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <Input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Column name"
            autoFocus
          />
          <Button type="submit" size="sm" disabled={!title.trim()}>
            Add Column
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}