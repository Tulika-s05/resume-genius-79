import { CheckCircle2, FileText, Lightbulb, FolderGit2, PlusCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScoreRing } from "@/components/ScoreRing";
import { JobMatchPanel } from "@/components/JobMatchPanel";
import type { AnalysisResponse } from "@/lib/types";

export function AnalysisResults({ data }: { data: AnalysisResponse }) {
  const a = data.analysis;
  const breakdown = [
    { label: "ATS Compatibility", value: a.ats_score },
    { label: "Keyword Match", value: a.keyword_score },
    { label: "Skills Match", value: a.skills_score },
    { label: "Formatting", value: a.formatting_score },
  ];

  return (
    <div className="animate-in fade-in space-y-6 duration-500">
      <div className="grid gap-6 md:grid-cols-[auto_1fr]">
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Overall score</CardTitle>
            <CardDescription className="truncate">{data.filename}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-8">
            <ScoreRing score={a.overall_score} />
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Score breakdown</CardTitle>
            <CardDescription>
              {data.target_role ? `Target role: ${data.target_role}` : "General analysis"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {breakdown.map((b) => (
              <div key={b.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium">{b.label}</span>
                  <span className="text-muted-foreground">{b.value}%</span>
                </div>
                <Progress value={b.value} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="size-5 text-primary" /> Resume summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">{a.summary}</p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Matched skills</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {a.matched_skills.length ? (
              a.matched_skills.map((s) => (
                <Badge key={s} variant="secondary">
                  {s}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No skills detected.</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Missing / recommended skills</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {a.missing_skills.length ? (
              a.missing_skills.map((s) => (
                <Badge key={s} variant="outline">
                  <PlusCircle className="size-3" />
                  {s}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Nothing critical is missing.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ListCard
          title="Strengths"
          icon={<CheckCircle2 className="size-5 text-success" />}
          items={a.strengths}
        />
        <ListCard
          title="Improvements"
          icon={<Lightbulb className="size-5 text-warning" />}
          items={a.improvements}
        />
      </div>

      {a.project_feedback.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FolderGit2 className="size-5 text-primary" /> Project & experience feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {a.project_feedback.map((p, i) => (
              <div key={i} className="rounded-lg border border-border bg-secondary/40 p-4">
                <h4 className="text-sm font-semibold">{p.title}</h4>
                <p className="mt-1 text-sm text-muted-foreground">{p.feedback}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <JobMatchPanel resumeText={data.resume_text} analysisId={data.id} />
    </div>
  );
}

function ListCard({
  title,
  icon,
  items,
}: {
  title: string;
  icon: React.ReactNode;
  items: string[];
}) {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          {icon} {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 text-sm text-muted-foreground">
          {items.map((item, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
