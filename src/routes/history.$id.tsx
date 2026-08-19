import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { AnalysisResults } from "@/components/AnalysisResults";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";

export const Route = createFileRoute("/history/$id")({
  head: () => ({
    meta: [
      { title: "Saved Analysis — CVision" },
      {
        name: "description",
        content: "View a saved Cvision resume analysis with scores, skills and improvements.",
      },
      { property: "og:title", content: "Saved Analysis — CVision" },
      { property: "og:description", content: "A previously saved AI resume analysis." },
    ],
  }),
  component: HistoryDetail,
});

function HistoryDetail() {
  const { id } = Route.useParams();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["analysis", id],
    queryFn: () => api.getAnalysis(Number(id)),
    retry: false,
  });

  return (
    <AppShell title="Saved analysis" description={data?.filename}>
      <div className="space-y-6">
        <Button asChild variant="ghost" size="sm">
          <Link to="/history">
            <ArrowLeft className="size-4" /> Back to history
          </Link>
        </Button>

        {isLoading && <Skeleton className="h-64 w-full" />}
        {isError && (
          <Card className="shadow-card">
            <CardContent className="py-8 text-sm text-destructive">
              {error instanceof Error ? error.message : "Could not load this analysis."}
            </CardContent>
          </Card>
        )}
        {data && <AnalysisResults data={data} />}
      </div>
    </AppShell>
  );
}
