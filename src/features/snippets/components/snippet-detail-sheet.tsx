"use client";

import { Trash2, Pencil, Eye } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SnippetForm, type SnippetSubmitValues } from "./snippet-form";
import { CodePreview } from "./code-preview";
import { snippetRepository } from "@/lib/storage/snippet-repository";
import type { Snippet } from "@/lib/schema";

interface SnippetDetailSheetProps {
  snippet: Snippet | null;
  onOpenChange: (open: boolean) => void;
  onUpdated: () => void;
}

export function SnippetDetailSheet({ snippet, onOpenChange, onUpdated }: SnippetDetailSheetProps) {
  async function handleUpdate(values: SnippetSubmitValues) {
    if (!snippet) return;
    await snippetRepository.update(snippet.id, values);
    onUpdated();
    onOpenChange(false);
  }

  async function handleDelete() {
    if (!snippet) return;
    await snippetRepository.remove(snippet.id);
    onUpdated();
    onOpenChange(false);
  }

  return (
    <Sheet open={snippet !== null} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Edit Snippet</SheetTitle>
          <SheetDescription>Update this snippet or delete it.</SheetDescription>
        </SheetHeader>
        {snippet && (
          <div className="flex flex-col gap-6 px-4 pb-4">
            <Tabs defaultValue="edit">
              <TabsList>
                <TabsTrigger value="edit">
                  <Pencil className="h-4 w-4" />
                  Edit
                </TabsTrigger>
                <TabsTrigger value="preview">
                  <Eye className="h-4 w-4" />
                  Preview
                </TabsTrigger>
              </TabsList>
              <TabsContent value="edit">
                <SnippetForm
                  defaultValues={{
                    title: snippet.title,
                    language: snippet.language,
                    code: snippet.code,
                  }}
                  defaultTags={snippet.tags}
                  submitLabel="Save Changes"
                  onSubmit={handleUpdate}
                  onCancel={() => onOpenChange(false)}
                />
              </TabsContent>
              <TabsContent value="preview">
                <CodePreview code={snippet.code} language={snippet.language} />
              </TabsContent>
            </Tabs>

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
                Delete Snippet
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this snippet?</AlertDialogTitle>
                  <AlertDialogDescription>
                    {`This action cannot be undone. This will permanently delete "${snippet.title}".`}
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