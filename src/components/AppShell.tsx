import { Link } from "@tanstack/react-router";
import { LayoutDashboard, ScanLine, History, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/analyze", label: "Analyze", icon: ScanLine },
  { to: "/history", label: "History", icon: History },
] as const;

export function AppShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string | undefined;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-sidebar px-4 py-6 md:flex">
        <Link to="/" className="mb-8 flex items-center gap-2 px-2">
          <span className="bg-brand flex size-9 items-center justify-center rounded-xl shadow-glow">
            <Sparkles className="size-5 text-primary-foreground" />
          </span>
          <span className="text-lg font-semibold tracking-tight">ResumeIQ</span>
        </Link>
        <nav className="flex flex-col gap-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeProps={{
                className:
                  "bg-secondary text-secondary-foreground font-medium ring-1 ring-border",
              }}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </nav>
        <p className="mt-auto px-3 text-xs text-muted-foreground">
          React · FastAPI · Gemini · SQLite
        </p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 border-b border-border bg-card/80 px-5 py-4 backdrop-blur md:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="truncate text-xl font-semibold tracking-tight">{title}</h1>
              {description && (
                <p className="truncate text-sm text-muted-foreground">{description}</p>
              )}
            </div>
            <nav className="flex gap-1 md:hidden">
              {nav.map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  aria-label={label}
                  activeProps={{ className: "bg-secondary text-foreground" }}
                  className="rounded-lg p-2 text-muted-foreground"
                >
                  <Icon className="size-5" />
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8 md:px-8">{children}</main>
      </div>
    </div>
  );
}
