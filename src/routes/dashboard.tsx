import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  ChevronRight,
  FileText,
  Upload,
  BrainCircuit,
  TrendingUp,
} from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { Mascot } from "@/components/Mascot";
import { ResumeUploader } from "@/components/ResumeUploader";
import { Skeleton } from "@/components/ui/skeleton";
import { api, scoreLabel } from "@/lib/api";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — CVision" },
      {
        name: "description",
        content: "Your CVision overview: upload a resume, see your scores and recent reviews.",
      },
      { property: "og:title", content: "Dashboard — CVision" },
      { property: "og:description", content: "Overview of your resume analyses and scores." },
    ],
  }),
  component: Dashboard,
});

const previewMetrics = [
  { label: "Keywords Match", value: 94, note: "Keyword coverage" },
  { label: "Skills Match", value: 88, note: "Skill alignment" },
  { label: "Formatting", value: 92, note: "Well structured" },
  { label: "Experience", value: 90, note: "Strong experience" },
];

const steps = [
  {
    n: "01",
    icon: Upload,
    title: "Upload Resume",
    text: "Upload your resume in PDF or DOCX format.",
  },
  {
    n: "02",
    icon: BrainCircuit,
    title: "AI Analysis",
    text: "Gemini analyzes your resume like a recruiter and ATS.",
  },
  {
    n: "03",
    icon: TrendingUp,
    title: "Get Improved",
    text: "Get actionable recommendations to improve your chances.",
  },
];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function Dashboard() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["history"],
    queryFn: api.getHistory,
    retry: false,
  });

  const items = data ?? [];

  return (
    <AppShell
      title={`${greeting()}, Tulika. 👋`}
      description="Let's make your resume stand out today."
    >
      <div className="space-y-10">
        <section className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          <div className="neu neu-hover relative overflow-hidden p-7 md:p-9">
            <h2 className="max-w-md text-3xl leading-tight font-bold tracking-tight md:text-4xl">
              Let's see what your resume is{" "}
              <span className="ink-underline text-primary">really</span> saying.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              I'll review your resume for ATS compatibility, keywords, skills and more — and help
              you improve your chances of getting hired.
            </p>

            <div className="mt-7 flex flex-wrap items-end gap-4">
              <Link
                to="/analyze"
                className="neu-press inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow"
              >
                <Upload className="size-4" /> Upload Your Resume
              </Link>
              <span className="font-hand text-base text-muted-foreground">— pdf or docx</span>
            </div>

            <div className="pointer-events-none absolute right-6 bottom-6 hidden items-end gap-2 md:flex">
              <span className="neu-sm max-w-[9rem] rounded-2xl px-3 py-2 text-center font-hand text-base leading-tight">
                Drop it here and I'll take it from there!
              </span>
              <Mascot size={56} className="animate-float" />
            </div>
          </div>

          <div className="neu neu-hover p-6">
            <ResumeUploader
              onAnalyzed={(res) =>
                navigate({ to: "/history/$id", params: { id: String(res.id) } })
              }
            />
          </div>
        </section>

        <section>
          <h3 className="mb-4 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            Your Resume Score Preview
          </h3>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
            <div className="neu neu-hover flex flex-col items-center gap-2 p-6">
              <p className="self-start text-xs text-muted-foreground">ATS Score</p>
              <PreviewRing score={92} />
              <span className="neu-inset rounded-full px-3 py-1 text-[11px] font-medium text-primary">
                Excellent
              </span>
            </div>
            {previewMetrics.map((m) => (
              <div key={m.label} className="neu neu-hover flex flex-col p-6">
                <p className="text-xs text-muted-foreground">{m.label}</p>
                <p className="mt-2 text-3xl font-bold tracking-tight">{m.value}%</p>
                <div className="neu-inset mt-4 h-2 w-full overflow-hidden rounded-full">
                  <div
                    className="h-full rounded-full bg-primary transition-[width] duration-700"
                    style={{ width: `${m.value}%` }}
                  />
                </div>
                <span className="neu-inset mt-4 self-start rounded-full px-2.5 py-1 text-[11px] font-medium text-primary">
                  {scoreLabel(m.value)}
                </span>
                <p className="mt-2 text-[11px] text-muted-foreground">{m.note}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Sample preview values — your real scores appear after an analysis.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="neu p-7">
            <h3 className="text-base font-bold">How CVision Works</h3>
            <div className="relative mt-6 grid gap-6 sm:grid-cols-3">
              <span className="absolute top-6 right-8 left-8 hidden h-px bg-border sm:block" />
              {steps.map((s) => (
                <div key={s.n} className="relative flex flex-col items-start gap-3">
                  <span className="neu-sm relative z-10 flex size-12 items-center justify-center rounded-2xl">
                    <s.icon className="size-5 text-primary" />
                  </span>
                  <span className="text-[11px] font-semibold tracking-widest text-primary">
                    {s.n}
                  </span>
                  <p className="text-sm font-semibold">{s.title}</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">{s.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="neu p-7">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold">Recent Analyses</h3>
              <Link
                to="/history"
                className="inline-flex items-center gap-1 text-xs font-medium text-primary"
              >
                View all <ArrowRight className="size-3.5" />
              </Link>
            </div>

            <div className="mt-5 space-y-3">
              {isLoading && <Skeleton className="h-16 w-full" />}
              {!isLoading && items.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No analyses yet — upload a resume to see it here.
                </p>
              )}
              {items.slice(0, 5).map((item) => (
                <Link
                  key={item.id}
                  to="/history/$id"
                  params={{ id: String(item.id) }}
                  className="neu-sm neu-press flex items-center gap-3 p-3.5"
                >
                  <span className="neu-inset flex size-9 shrink-0 items-center justify-center rounded-lg">
                    <FileText className="size-4 text-primary" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{item.filename}</span>
                    <span className="block text-[11px] text-muted-foreground">
                      {item.target_role || "General analysis"} ·{" "}
                      {new Date(item.created_at).toLocaleString()}
                    </span>
                  </span>
                  <span className="neu-inset flex size-9 items-center justify-center rounded-full text-xs font-bold text-primary">
                    {item.overall_score}
                  </span>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function PreviewRing({ score }: { score: number }) {
  const size = 96;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - score / 100)}
          style={{ transition: "stroke-dashoffset 900ms ease-out" }}
        />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold">{score}</span>
        <span className="text-[10px] text-muted-foreground">/100</span>
      </span>
    </div>
  );
}
