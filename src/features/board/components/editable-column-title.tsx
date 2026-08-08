"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { columnRepository } from "@/lib/storage/column-repository";

interface EditableColumnTitleProps {
  columnId: string;
  title: string;
  onRenamed: () => void;
}

export function EditableColumnTitle({ columnId, title, onRenamed }: EditableColumnTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) inputRef.current?.select();
  }, [isEditing]);

  async function commit() {
    const trimmed = value.trim();
    setIsEditing(false);

    if (!trimmed || trimmed === title) {
      setValue(title);
      return;
    }

    await columnRepository.update(columnId, { title: trimmed });
    onRenamed();
  }

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === "Enter") commit();
          if (event.key === "Escape") {
            setValue(title);
            setIsEditing(false);
          }
        }}
        className="h-6 px-1 text-sm font-semibold"
        autoFocus
      />
    );
  }

  return (
    <h3
      onClick={() => setIsEditing(true)}
      className="cursor-text rounded px-1 text-sm font-semibold hover:bg-muted"
    >
      {title}
    </h3>
  );
}