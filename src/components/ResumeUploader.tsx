import { useRef, useState } from "react";
import { toast } from "sonner";
import { FileUp, Loader2, X, FileText, Sparkles, FolderOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MAX_FILE_SIZE, api, formatBytes } from "@/lib/api";
import type { AnalysisResponse } from "@/lib/types";

const ACCEPTED = [".pdf", ".docx"];

export function ResumeUploader({
  onAnalyzed,
  onLoadingChange,
  showRoleField = true,
}: {
  onAnalyzed: (result: AnalysisResponse) => void;
  onLoadingChange?: (loading: boolean) => void;
  showRoleField?: boolean;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function setBusy(next: boolean) {
    setLoading(next);
    onLoadingChange?.(next);
  }

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
    setBusy(true);
    try {
      const res = await api.analyzeResume(file, role);
      onAnalyzed(res);
      toast.success("Analysis complete");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      {file ? (
        <div className="neu-inset flex items-center gap-3 p-4">
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
        <div
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
          className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-9 text-center transition-all duration-200 ${
            dragging
              ? "scale-[1.01] border-primary bg-accent/50"
              : "border-border/80 bg-background/60"
          }`}
        >
          <span className="neu-sm mb-4 flex size-14 items-center justify-center rounded-2xl">
            <FileUp className="size-6 text-primary" />
          </span>
          <p className="text-sm font-semibold">Drop your resume here</p>
          <p className="mt-1 text-xs text-muted-foreground">PDF or DOCX • Max 5MB</p>
          <div className="my-4 flex w-full items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-[11px] tracking-wide text-muted-foreground uppercase">or</span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="neu-sm neu-press inline-flex items-center gap-2 px-4 py-2 text-sm font-medium"
          >
            <FolderOpen className="size-4 text-primary" /> Browse Files
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx"
        className="hidden"
        onChange={(e) => pick(e.target.files?.[0])}
      />

      {showRoleField && (
        <div className="space-y-2">
          <Label htmlFor="role" className="text-xs text-muted-foreground">
            Target job role (optional)
          </Label>
          <Input
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Frontend Developer"
            disabled={loading}
            className="neu-inset border-transparent shadow-none"
          />
        </div>
      )}

      <button
        type="button"
        onClick={analyze}
        disabled={loading || !file}
        className="neu-press flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
        {loading ? "Analyzing your resume…" : "Analyze with Gemini ✦"}
      </button>
    </div>
  );
}
