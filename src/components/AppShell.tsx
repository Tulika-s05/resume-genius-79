import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  History,
  Bookmark,
  Target,
  Settings,
  Bell,
  Menu,
  Moon,
  Sun,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { Mascot } from "@/components/Mascot";
import { useTheme } from "@/lib/theme";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/history", label: "History", icon: History },
  { to: "/saved-reports", label: "Saved Reports", icon: Bookmark },
  { to: "/job-match", label: "Job Match", icon: Target },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  const { theme, toggle } = useTheme();

  return (
    <div className="flex h-full flex-col px-4 py-6">
      <Link to="/" onClick={onNavigate} className="mb-8 flex items-center gap-3 px-2">
        <Mascot size={38} className="animate-float" />
        <span>
          <span className="block text-lg leading-tight font-bold tracking-tight">CVision</span>
          <span className="block text-[11px] text-muted-foreground">AI Resume Analyst</span>
        </span>
      </Link>

      <nav className="flex flex-col gap-1.5">
        {nav.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            activeProps={{
              className:
                "neu-sm bg-accent/60 text-accent-foreground font-semibold [&_svg]:text-primary",
            }}
            className="neu-press flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Icon className="size-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto space-y-4">
        <div className="neu-sm p-4 text-center">
          <Mascot size={30} className="mx-auto" />
          <p className="mt-2 text-sm font-semibold">Upgrade to Pro</p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            Unlock advanced insights, priority support and more.
          </p>
          <button
            type="button"
            className="neu-press mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-semibold text-primary"
          >
            Upgrade Now <ArrowRight className="size-3.5" />
          </button>
        </div>

        <button
          type="button"
          onClick={toggle}
          aria-label="Toggle color theme"
          className="neu-press flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs text-muted-foreground"
        >
          <span className="flex items-center gap-2">
            {theme === "dark" ? <Moon className="size-3.5" /> : <Sun className="size-3.5" />}
            {theme === "dark" ? "Dark" : "Light"} mode
          </span>
          <span className="neu-inset flex h-5 w-9 items-center rounded-full px-0.5">
            <span
              className={`size-4 rounded-full bg-primary transition-transform ${
                theme === "dark" ? "translate-x-4" : ""
              }`}
            />
          </span>
        </button>
      </div>
    </div>
  );
}

export function AppShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string | undefined;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 border-r border-border/70 bg-sidebar lg:block">
        <div className="sticky top-0 h-screen">
          <SidebarBody />
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-64 bg-sidebar shadow-card">
            <SidebarBody onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 px-5 py-4 backdrop-blur md:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                aria-label="Open menu"
                onClick={() => setOpen(true)}
                className="neu-sm neu-press flex size-9 items-center justify-center lg:hidden"
              >
                <Menu className="size-4" />
              </button>
              <div className="min-w-0">
                <h1 className="truncate text-xl font-bold tracking-tight">{title}</h1>
                {description && (
                  <p className="truncate text-sm text-muted-foreground">{description}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="neu-sm hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium text-muted-foreground sm:inline-flex">
                <Sparkles className="size-3.5 text-primary" /> Powered by Gemini
              </span>
              <button
                type="button"
                aria-label="Notifications"
                className="neu-sm neu-press relative flex size-9 items-center justify-center rounded-full"
              >
                <Bell className="size-4 text-muted-foreground" />
                <span className="absolute top-2 right-2.5 size-1.5 rounded-full bg-primary" />
              </button>
              <span className="neu-sm flex size-9 items-center justify-center rounded-full text-sm font-semibold text-primary">
                T
              </span>
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8 md:px-8">{children}</main>
      </div>
    </div>
  );
}
