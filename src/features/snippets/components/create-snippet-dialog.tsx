"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SnippetForm, type SnippetSubmitValues } from "./snippet-form";
import { snippetRepository } from "@/lib/storage/snippet-repository";
import type { Snippet } from "@/lib/schema";

interface CreateSnippetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (snippet: Snippet) => void;
}

export function CreateSnippetDialog({ open, onOpenChange, onCreated }: CreateSnippetDialogProps) {
  async function handleSubmit(values: SnippetSubmitValues) {
    const snippet = await snippetRepository.create(values);
    onOpenChange(false);
    onCreated(snippet);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Snippet</DialogTitle>
        </DialogHeader>
        <SnippetForm onSubmit={handleSubmit} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}