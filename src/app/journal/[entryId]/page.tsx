"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useJournalEntry } from "@/features/journal/hooks/use-journal-entry";
import { journalRepository } from "@/lib/storage/journal-repository";
import { MarkdownContent } from "@/features/journal/components/markdown-content";

export default function JournalEntryPage() {
  const { entryId } = useParams<{ entryId: string }>();
  const router = useRouter();
  const { entry, isLoading } = useJournalEntry(entryId);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (entry) {
      setTitle(entry.title);
      setContent(entry.content);
      setIsDirty(false);
    }
  }, [entry]);

  async function handleSave() {
    if (!entry) return;
    setIsSaving(true);
    await journalRepository.update(entry.id, { title, content });
    setIsSaving(false);
    setIsDirty(false);
  }

  async function handleDelete() {
    if (!entry) return;
    await journalRepository.remove(entry.id);
    router.push("/journal");
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
        Loading entry…
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
        <p>Entry not found.</p>
        <Link href="/journal" className="text-foreground underline underline-offset-4">
          Back to Journal
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <Link
          href="/journal"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Journal
        </Link>
        <div className="flex items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger
              render={<Button variant="ghost" size="icon" aria-label="Delete entry" />}
            >
              <Trash2 className="h-4 w-4" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
                <AlertDialogDescription>
                  {`This action cannot be undone. This will permanently delete "${entry.title}".`}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button onClick={handleSave} disabled={!isDirty || isSaving}>
            {isSaving ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 p-6">
        <Input
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            setIsDirty(true);
          }}
          className="border-none px-0 font-heading text-2xl font-semibold shadow-none focus-visible:ring-0"
          placeholder="Entry title"
        />

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
            <Textarea
              value={content}
              onChange={(event) => {
                setContent(event.target.value);
                setIsDirty(true);
              }}
              placeholder="Write in Markdown…"
              className="min-h-[60vh] font-mono text-sm"
            />
          </TabsContent>
          <TabsContent value="preview">
            <div className="min-h-[60vh] rounded-lg border border-border p-4">
              {content ? (
                <MarkdownContent content={content} />
              ) : (
                <p className="text-sm text-muted-foreground">Nothing to preview yet.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}