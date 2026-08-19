import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";

export const Route = createFileRoute("/history/")({
  head: () => ({
    meta: [
      { title: "Analysis History — CVision" },
      {
        name: "description",
        content: "Browse, reopen and delete your previously saved CVision resume analyses.",
      },
      { property: "og:title", content: "Analysis History — CVision" },
      { property: "og:description", content: "All of your saved resume analyses in one place." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const qc = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["history"],
    queryFn: api.getHistory,
    retry: false,
  });

  const del = useMutation({
    mutationFn: api.deleteAnalysis,
    onSuccess: () => {
      toast.success("Analysis deleted");
      qc.invalidateQueries({ queryKey: ["history"] });
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Delete failed"),
  });

  const items = data ?? [];

  return (
    <AppShell title="History" description="Previously saved analyses.">
      <div className="space-y-4">
        {isLoading && <Skeleton className="h-24 w-full" />}

        {isError && (
          <Card className="shadow-card">
            <CardContent className="py-8 text-sm text-destructive">
              {error instanceof Error ? error.message : "Could not load history."}
            </CardContent>
          </Card>
        )}

        {!isLoading && !isError && items.length === 0 && (
          <Card className="shadow-card">
            <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
              <p className="text-sm text-muted-foreground">You haven't analyzed a resume yet.</p>
              <Button asChild>
                <Link to="/analyze">Analyze Resume</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {items.map((item) => (
          <Card key={item.id} className="shadow-card">
            <CardContent className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.filename}</p>
                <p className="text-xs text-muted-foreground">
                  {item.target_role || "General analysis"} ·{" "}
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </div>
              <span className="text-sm font-semibold text-primary">
                {item.overall_score} / 100
              </span>
              <div className="flex gap-2">
                <Button asChild variant="secondary" size="sm">
                  <Link to="/history/$id" params={{ id: String(item.id) }}>
                    <Eye className="size-4" /> View
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => del.mutate(item.id)}
                  disabled={del.isPending}
                >
                  <Trash2 className="size-4" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
