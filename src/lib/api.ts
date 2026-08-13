import type { AnalysisResponse, HistoryItem, JobMatchResult } from "./types";

export const API_URL =
  (import.meta.env["VITE_API_URL"] as string | undefined)?.replace(/\/$/, "") ??
  "http://localhost:8000";

export const MAX_FILE_SIZE = 5 * 1024 * 1024;

export class ApiError extends Error {}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (typeof body?.detail === "string") detail = body.detail;
      else if (Array.isArray(body?.detail)) detail = body.detail[0]?.msg ?? detail;
    } catch {
      /* keep default message */
    }
    throw new ApiError(detail);
  }
  return (await res.json()) as T;
}

function wrapNetwork(err: unknown): never {
  if (err instanceof ApiError) throw err;
  throw new ApiError(
    `Cannot reach the ResumeIQ API at ${API_URL}. Start the FastAPI server and try again.`,
  );
}

export const api = {
  async analyzeResume(file: File, targetRole: string): Promise<AnalysisResponse> {
    const form = new FormData();
    form.append("file", file);
    if (targetRole.trim()) form.append("target_role", targetRole.trim());
    try {
      return await handle<AnalysisResponse>(
        await fetch(`${API_URL}/api/resume/analyze`, { method: "POST", body: form }),
      );
    } catch (err) {
      wrapNetwork(err);
    }
  },

  async jobMatch(
    resumeText: string,
    jobDescription: string,
    analysisId?: number,
  ): Promise<JobMatchResult> {
    try {
      return await handle<JobMatchResult>(
        await fetch(`${API_URL}/api/resume/job-match`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resume_text: resumeText,
            job_description: jobDescription,
            analysis_id: analysisId ?? null,
          }),
        }),
      );
    } catch (err) {
      wrapNetwork(err);
    }
  },

  async getHistory(): Promise<HistoryItem[]> {
    try {
      return await handle<HistoryItem[]>(await fetch(`${API_URL}/api/history`));
    } catch (err) {
      wrapNetwork(err);
    }
  },

  async getAnalysis(id: number): Promise<AnalysisResponse> {
    try {
      return await handle<AnalysisResponse>(await fetch(`${API_URL}/api/history/${id}`));
    } catch (err) {
      wrapNetwork(err);
    }
  },

  async deleteAnalysis(id: number): Promise<void> {
    try {
      await handle<unknown>(await fetch(`${API_URL}/api/history/${id}`, { method: "DELETE" }));
    } catch (err) {
      wrapNetwork(err);
    }
  },
};

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function scoreLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 60) return "Fair";
  return "Needs work";
}
