import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { AnalysisResults } from "@/components/AnalysisResults";
import { Mascot } from "@/components/Mascot";
import { ResumeUploader } from "@/components/ResumeUploader";
import type { AnalysisResponse } from "@/lib/types";

export const Route = createFileRoute("/analyze")({
  head: () => ({
    meta: [
      { title: "Analyze Resume — CVision" },
      {
        name: "description",
        content: "Upload a PDF or DOCX resume and get an AI analysis with ATS and skill scores.",
      },
      { property: "og:title", content: "Analyze Resume — CVision" },
      {
        property: "og:description",
        content: "Upload a resume and get an instant AI-powered ATS analysis.",
      },
    ],
  }),
  component: AnalyzePage,
});

function AnalyzePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);

  return (
    <AppShell title="Analyze" description="Upload a resume and let the AI review it.">
      <div className="space-y-6">
        <div className="neu grid gap-6 p-7 md:grid-cols-[1fr_1.1fr]">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Let's see what your resume is{" "}
              <span className="ink-underline text-primary">really</span> saying.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              I'll review your resume for ATS compatibility, keywords, skills and more — and help
              you improve your chances of getting hired.
            </p>
            <div className="mt-6 flex items-end gap-2">
              <Mascot size={44} className="animate-float" />
              <span className="neu-sm max-w-[11rem] rounded-2xl px-3 py-2 font-hand text-base leading-tight">
                Drop it here and I'll take it from there!
              </span>
            </div>
          </div>
          <div className="neu-sm p-5">
            <ResumeUploader
              onAnalyzed={(res) => setResult(res)}
              onLoadingChange={(l) => {
                setLoading(l);
                if (l) setResult(null);
              }}
            />
          </div>
        </div>

        {loading && (
          <div className="neu flex flex-col items-center gap-3 py-12">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-sm font-medium">Analyzing your resume…</p>
            <p className="text-xs text-muted-foreground">
              Extracting text and asking Gemini for a structured review.
            </p>
          </div>
        )}

        {result && <AnalysisResults data={result} />}
      </div>
    </AppShell>
  );
}
