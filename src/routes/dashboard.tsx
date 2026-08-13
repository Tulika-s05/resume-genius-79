import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, FileText, Gauge, ScanLine } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api, scoreLabel } from "@/lib/api";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — ResumeIQ" },
      {
        name: "description",
        content: "Your ResumeIQ overview: analyses run, average score and recent resume reviews.",
      },
      { property: "og:title", content: "Dashboard — ResumeIQ" },
      { property: "og:description", content: "Overview of your resume analyses and scores." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["history"],
    queryFn: api.getHistory,
    retry: false,
  });

  const items = data ?? [];
  const avg = items.length
    ? Math.round(items.reduce((s, i) => s + i.overall_score, 0) / items.length)
    : 0;

  return (
    <AppShell title="Dashboard" description="An overview of your resume analyses.">
      <div className="space-y-6">
        <Card className="overflow-hidden shadow-card">
          <CardContent className="flex flex-col items-start justify-between gap-4 py-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold">Ready for a new review?</h2>
              <p className="text-sm text-muted-foreground">
                Upload a PDF or DOCX resume and get scored in seconds.
              </p>
            </div>
            <Button asChild className="shadow-glow">
              <Link to="/analyze">
                <ScanLine className="size-4" /> Analyze Resume
              </Link>
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-5 sm:grid-cols-2">
          <StatCard
            icon={<FileText className="size-5 text-primary" />}
            label="Analyses saved"
            value={isLoading ? null : String(items.length)}
          />
          <StatCard
            icon={<Gauge className="size-5 text-primary" />}
            label="Average score"
            value={isLoading ? null : items.length ? `${avg} · ${scoreLabel(avg)}` : "—"}
          />
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Recent analyses</CardTitle>
            <CardDescription>Your last few resume reviews.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading && <Skeleton className="h-20 w-full" />}
            {isError && (
              <p className="text-sm text-destructive">
                {error instanceof Error ? error.message : "Could not load history."}
              </p>
            )}
            {!isLoading && !isError && items.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No analyses yet — run your first one to see it here.
              </p>
            )}
            {items.slice(0, 5).map((item) => (
              <Link
                key={item.id}
                to="/history/$id"
                params={{ id: String(item.id) }}
                className="flex items-center justify-between gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-secondary/60"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.filename}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.target_role || "General analysis"} ·{" "}
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className="flex items-center gap-2 text-sm font-semibold text-primary">
                  {item.overall_score}
                  <ArrowRight className="size-4" />
                </span>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null;
}) {
  return (
    <Card className="shadow-card">
      <CardContent className="flex items-center gap-4 py-6">
        <span className="flex size-11 items-center justify-center rounded-xl bg-secondary">
          {icon}
        </span>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          {value === null ? (
            <Skeleton className="mt-1 h-6 w-20" />
          ) : (
            <p className="text-xl font-semibold">{value}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
