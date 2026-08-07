"use client";

import { useRef, useState } from "react";
import { Download, Upload, TriangleAlert } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import {
  exportAllData,
  downloadExport,
  parseImportFile,
  restoreAllData,
  resetAllData,
  type ExportedData,
} from "@/lib/data-transfer";
import { STORAGE_KEYS } from "@/lib/storage/keys";

export function DataSettings() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingImport, setPendingImport] = useState<ExportedData | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  async function handleExport() {
    const data = await exportAllData();
    downloadExport(data);
  }

  async function handleFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setImportError(null);
    try {
      const text = await file.text();
      const parsed = parseImportFile(text);
      setPendingImport(parsed);
    } catch {
      setImportError("That file doesn't look like a valid BluePrint export.");
    }
  }

  function confirmImport() {
    if (!pendingImport) return;
    restoreAllData(pendingImport);
    window.location.reload();
  }

  function confirmReset() {
    resetAllData();
    window.location.reload();
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Data</CardTitle>
          <CardDescription>
            Everything in BluePrint lives in this browser. Export a backup, restore one, or start
            fresh.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Export data</p>
              <p className="text-xs text-muted-foreground">Download everything as a JSON file.</p>
            </div>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Import data</p>
              <p className="text-xs text-muted-foreground">Restore from a previous export.</p>
            </div>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4" />
              Import
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              onChange={handleFileSelected}
              className="hidden"
            />
          </div>
          {importError && <p className="text-xs text-destructive">{importError}</p>}

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Welcome tour</p>
              <p className="text-xs text-muted-foreground">Replay the onboarding introduction.</p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                window.localStorage.removeItem(STORAGE_KEYS.hasOnboarded);
                window.location.reload();
              }}
            >
              Replay
            </Button>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-4">
            <div>
              <p className="text-sm font-medium text-destructive">Reset all data</p>
              <p className="text-xs text-muted-foreground">
                Permanently deletes everything. Cannot be undone.
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger render={<Button variant="destructive" />}>
                <TriangleAlert className="h-4 w-4" />
                Reset
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset all data?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This permanently deletes every board, task, journal entry, snippet, and focus
                    session. This cannot be undone — consider exporting a backup first.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmReset}>Reset Everything</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      <AlertDialog
        open={pendingImport !== null}
        onOpenChange={(open) => !open && setPendingImport(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Replace all current data?</AlertDialogTitle>
            <AlertDialogDescription>
              Importing this file will overwrite everything currently in BluePrint with the
              contents of the backup. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmImport}>Replace Data</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}