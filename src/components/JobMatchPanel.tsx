import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Target } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import type { JobMatchResult } from "@/lib/types";

export function JobMatchPanel({
  resumeText,
  analysisId,
}: {
  resumeText: string;
  analysisId?: number;
}) {
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<JobMatchResult | null>(null);

  async function compare() {
    if (jd.trim().length < 20) {
      toast.error("Paste a job description first (at least 20 characters).");
      return;
    }
    setLoading(true);
    try {
      const res = await api.jobMatch(resumeText, jd, analysisId);
      setResult(res);
      toast.success("Comparison ready");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Comparison failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="size-5 text-primary" /> Job description matching
        </CardTitle>
        <CardDescription>
          Paste a job posting to see how well this resume matches it.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          placeholder="Paste the full job description here..."
          className="min-h-36 resize-y"
        />
        <Button onClick={compare} disabled={loading}>
          {loading && <Loader2 className="size-4 animate-spin" />}
          {loading ? "Comparing..." : "Compare Resume"}
        </Button>

        {result && (
          <div className="animate-in fade-in space-y-5 border-t border-border pt-5">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm font-medium">
                <span>Match score</span>
                <span className="text-primary">{result.match_score}%</span>
              </div>
              <Progress value={result.match_score} />
            </div>

            <SkillGroup title="Matching skills" items={result.matching_skills} tone="success" />
            <SkillGroup title="Missing keywords" items={result.missing_keywords} tone="warning" />

            {result.recommended_changes.length > 0 && (
              <div>
                <h4 className="mb-2 text-sm font-semibold">Recommended changes</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {result.recommended_changes.map((c, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-primary">→</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SkillGroup({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "success" | "warning";
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <h4 className="mb-2 text-sm font-semibold">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {items.map((s) => (
          <Badge key={s} variant={tone === "success" ? "secondary" : "outline"}>
            {s}
          </Badge>
        ))}
      </div>
    </div>
  );
}
