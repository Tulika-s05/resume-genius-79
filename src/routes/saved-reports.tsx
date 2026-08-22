import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bookmark, ChevronRight, FileText } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { Skeleton } from "@/components/ui/skeleton";
import { api, scoreLabel } from "@/lib/api";

export const Route = createFileRoute("/saved-reports")({
  head: () => ({
    meta: [
      { title: "Saved Reports — CVision" },
      {
        name: "description",
        content: "Your saved CVision resume reports with scores, ready to reopen any time.",
      },
      { property: "og:title", content: "Saved Reports — CVision" },
      { property: "og:description", content: "Reopen your saved AI resume reports." },
    ],
  }),
  component: SavedReports,
});

function SavedReports() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["history"],
    queryFn: api.getHistory,
    retry: false,
  });

  const items = data ?? [];

  return (
    <AppShell title="Saved Reports" description="Every analysis CVision has stored for you.">
      <div className="space-y-4">
        {isLoading && <Skeleton className="h-24 w-full" />}
        {isError && (
          <div className="neu p-6 text-sm text-destructive">
            {error instanceof Error ? error.message : "Could not load your reports."}
          </div>
        )}
        {!isLoading && !isError && items.length === 0 && (
          <div className="neu flex flex-col items-center gap-3 p-12 text-center">
            <Bookmark className="size-6 text-primary" />
            <p className="text-sm text-muted-foreground">No saved reports yet.</p>
            <Link
              to="/analyze"
              className="neu-sm neu-press px-4 py-2 text-sm font-medium text-primary"
            >
              Analyze a resume
            </Link>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <Link
              key={item.id}
              to="/history/$id"
              params={{ id: String(item.id) }}
              className="neu neu-hover flex items-center gap-4 p-5"
            >
              <span className="neu-inset flex size-11 shrink-0 items-center justify-center rounded-xl">
                <FileText className="size-5 text-primary" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{item.filename}</span>
                <span className="block text-xs text-muted-foreground">
                  {item.target_role || "General analysis"} ·{" "}
                  {new Date(item.created_at).toLocaleString()}
                </span>
              </span>
              <span className="text-right">
                <span className="block text-lg font-bold text-primary">{item.overall_score}</span>
                <span className="block text-[10px] text-muted-foreground">
                  {scoreLabel(item.overall_score)}
                </span>
              </span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
