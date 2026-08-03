"use client";

import { useRouter } from "next/navigation";
import { NotebookText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useJournalEntries } from "@/features/journal/hooks/use-journal-entries";
import { journalRepository } from "@/lib/storage/journal-repository";
import { Skeleton } from "@/components/ui/skeleton";
import { DotGridBackground } from "@/components/dot-grid-background";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function JournalPage() {
  const router = useRouter();
  const { entries, isLoading } = useJournalEntries();

  async function handleNewEntry() {
    const entry = await journalRepository.create({
      title: formatDate(new Date().toISOString()),
      content: "",
    });
    router.push(`/journal/${entry.id}`);
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <h1 className="font-heading text-lg font-semibold">Journal</h1>
        <Button onClick={handleNewEntry}>
          <Plus className="h-4 w-4" />
          New Entry
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
  {isLoading ? (
    <div className="flex flex-col gap-2">
      {[0, 1, 2].map((i) => (
        <Skeleton key={i} className="h-20 rounded-lg" />
      ))}
    </div>
  ) : entries.length === 0 ? (
    <div className="relative flex flex-col items-center justify-center gap-3 py-24 text-center">
      <DotGridBackground />
      <NotebookText className="h-8 w-8 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">
        No entries yet. Start writing to capture today&apos;s progress.
      </p>
      <Button onClick={handleNewEntry} variant="outline">
        <Plus className="h-4 w-4" />
        New Entry
      </Button>
    </div>
  ) : (
    <div className="flex flex-col gap-2">
      {entries.map((entry) => (
        <button
          key={entry.id}
          onClick={() => router.push(`/journal/${entry.id}`)}
          className="flex flex-col items-start gap-1 rounded-lg border border-border p-4 text-left transition-colors hover:bg-muted/50"
        >
          <span className="font-medium">{entry.title}</span>
          <span className="text-xs text-muted-foreground">{formatDate(entry.createdAt)}</span>
          {entry.content && (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{entry.content}</p>
          )}
        </button>
      ))}
    </div>
  )}
</div>
    </div>
  );
}