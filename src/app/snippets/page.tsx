"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Code2, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useSnippets } from "@/features/snippets/hooks/use-snippets";
import { CreateSnippetDialog } from "@/features/snippets/components/create-snippet-dialog";
import { SnippetDetailSheet } from "@/features/snippets/components/snippet-detail-sheet";
import { SNIPPET_LANGUAGES } from "@/lib/languages";
import { DotGridBackground } from "@/components/dot-grid-background";
import { CornerMarks } from "@/components/corner-marks";
import type { Snippet } from "@/lib/schema";

function languageLabel(value: string) {
  return SNIPPET_LANGUAGES.find((lang) => lang.value === value)?.label ?? value;
}

function SnippetsPageContent() {
  const searchParams = useSearchParams();
  const deepLinkedSnippetId = searchParams.get("snippetId");

  const { snippets, isLoading, refresh } = useSnippets();
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState<Snippet | null>(null);

  useEffect(() => {
    if (!deepLinkedSnippetId || snippets.length === 0) return;
    const match = snippets.find((snippet) => snippet.id === deepLinkedSnippetId);
    if (match) setSelected(match);
  }, [deepLinkedSnippetId, snippets]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return snippets;
    return snippets.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.language.toLowerCase().includes(q) ||
        s.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [snippets, query]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
        <h1 className="font-heading text-2xl font-semibold">Snippets</h1>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          New Snippet
        </Button>
      </div>

      <div className="border-b border-border px-6 py-3">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search snippets…"
            className="pl-8"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="relative flex flex-col items-center justify-center gap-3 py-24 text-center">
            {snippets.length === 0 && <DotGridBackground />}
            <Code2 className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {snippets.length === 0
                ? "No snippets yet. Save your first reusable piece of code."
                : "No snippets match your search."}
            </p>
            {snippets.length === 0 && (
              <Button onClick={() => setCreateOpen(true)} variant="outline">
                <Plus className="h-4 w-4" />
                New Snippet
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((snippet) => (
              <button
                key={snippet.id}
                onClick={() => setSelected(snippet)}
                className="group relative flex flex-col gap-2 rounded-lg border border-border p-4 text-left transition-colors hover:border-primary/40 hover:bg-muted/50"
              >
                <CornerMarks className="opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{snippet.title}</span>
                  <Badge variant="outline" className="font-mono text-xs uppercase">
                    {languageLabel(snippet.language)}
                  </Badge>
                </div>
                <pre className="max-h-24 overflow-hidden font-mono text-xs text-muted-foreground">
                  {snippet.code.slice(0, 200)}
                </pre>
                {snippet.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {snippet.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <CreateSnippetDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={async () => {
          await refresh();
        }}
      />
      <SnippetDetailSheet
        snippet={selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        onUpdated={refresh}
      />
    </div>
  );
}

export default function SnippetsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          Loading…
        </div>
      }
    >
      <SnippetsPageContent />
    </Suspense>
  );
}