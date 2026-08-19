import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { FileUp, Loader2, X, FileText } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { AnalysisResults } from "@/components/AnalysisResults";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MAX_FILE_SIZE, api, formatBytes } from "@/lib/api";
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

const ACCEPTED = [".pdf", ".docx"];

function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function pick(next: File | undefined) {
    if (!next) return;
    const ok = ACCEPTED.some((ext) => next.name.toLowerCase().endsWith(ext));
    if (!ok) {
      toast.error("Unsupported file type. Upload a PDF or DOCX resume.");
      return;
    }
    if (next.size > MAX_FILE_SIZE) {
      toast.error("File is too large. Maximum size is 5 MB.");
      return;
    }
    setFile(next);
  }

  async function analyze() {
    if (!file) {
      toast.error("Select a resume first.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await api.analyzeResume(file, role);
      setResult(res);
      toast.success("Analysis complete");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell title="Analyze" description="Upload a resume and let the AI review it.">
      <div className="space-y-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Upload resume</CardTitle>
            <CardDescription>PDF or DOCX, up to 5 MB.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {file ? (
              <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary/50 p-4">
                <FileText className="size-8 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Remove file"
                  onClick={() => setFile(null)}
                  disabled={loading}
                >
                  <X className="size-4" />
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  pick(e.dataTransfer.files?.[0]);
                }}
                className={`flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-colors ${
                  dragging ? "border-primary bg-accent/40" : "border-border hover:bg-secondary/50"
                }`}
              >
                <FileUp className="size-8 text-primary" />
                <p className="mt-3 text-sm font-medium">Drag & drop your resume here</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  or click to browse — PDF or DOCX, max 5 MB
                </p>
              </button>
            )}
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={(e) => pick(e.target.files?.[0])}
            />

            <div className="space-y-2">
              <Label htmlFor="role">Target job role (optional)</Label>
              <Input
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Frontend Developer"
                disabled={loading}
              />
            </div>

            <Button onClick={analyze} disabled={loading || !file} className="w-full sm:w-auto">
              {loading && <Loader2 className="size-4 animate-spin" />}
              {loading ? "Analyzing your resume..." : "Analyze Resume"}
            </Button>
          </CardContent>
        </Card>

        {loading && (
          <Card className="shadow-card">
            <CardContent className="flex flex-col items-center gap-3 py-12">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-sm font-medium">Analyzing your resume...</p>
              <p className="text-xs text-muted-foreground">
                Extracting text and asking Gemini for a structured review.
              </p>
            </CardContent>
          </Card>
        )}

        {result && <AnalysisResults data={result} />}
      </div>
    </AppShell>
  );
}
