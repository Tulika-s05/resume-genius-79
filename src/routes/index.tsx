import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Upload, BrainCircuit, TrendingUp, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CVision — AI Resume Analyzer & ATS Score Checker" },
      {
        name: "description",
        content:
          "Upload your resume and get an instant AI-powered ATS score, skill gaps, strengths and actionable improvements for your target role.",
      },
      { property: "og:title", content: "CVision — AI Resume Analyzer" },
      {
        property: "og:description",
        content:
          "Instant AI resume analysis: ATS score, keyword match, skill gaps and job-description matching.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const steps = [
  {
    icon: Upload,
    title: "Upload",
    text: "Drop in a PDF or DOCX resume and optionally name the role you're targeting.",
  },
  {
    icon: BrainCircuit,
    title: "AI Analysis",
    text: "Gemini reviews your resume like an ATS and a senior recruiter would.",
  },
  {
    icon: TrendingUp,
    title: "Improve",
    text: "Get scores, missing skills and concrete edits that raise your chances.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <span className="bg-brand flex size-9 items-center justify-center rounded-xl shadow-glow">
            <Sparkles className="size-5 text-primary-foreground" />
          </span>
          <span className="text-lg font-semibold tracking-tight">CVision</span>
        </div>
        <Link to="/history" className="text-sm text-muted-foreground hover:text-foreground">
          History
        </Link>
      </header>

      <section className="mx-auto max-w-3xl px-6 pt-16 pb-20 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-card">
          <Sparkles className="size-3.5 text-primary" /> Powered by Gemini
        </span>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Analyze your resume. <span className="text-brand">Improve your chances.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground">
          CVision scores your resume for ATS compatibility, keywords and skills, then tells you
          exactly what to fix before you apply.
        </p>
        <div className="mt-8 flex justify-center">
          <Button asChild size="lg" className="shadow-glow">
            <Link to="/analyze">
              Analyze Resume <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid gap-5 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="surface-panel p-6 transition-shadow hover:shadow-glow">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-secondary">
                  <s.icon className="size-5 text-primary" />
                </span>
                <span className="text-xs font-medium text-muted-foreground">Step {i + 1}</span>
              </div>
              <h2 className="mt-4 text-lg font-semibold">{s.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
