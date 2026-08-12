import { cn } from "@/lib/utils";

export function CornerMarks({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0", className)} aria-hidden>
      <span className="absolute -left-px -top-px h-2.5 w-2.5 border-l-2 border-t-2 border-primary" />
      <span className="absolute -right-px -top-px h-2.5 w-2.5 border-r-2 border-t-2 border-primary" />
      <span className="absolute -bottom-px -left-px h-2.5 w-2.5 border-b-2 border-l-2 border-primary" />
      <span className="absolute -bottom-px -right-px h-2.5 w-2.5 border-b-2 border-r-2 border-primary" />
    </div>
  );
}