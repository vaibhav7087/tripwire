"use client";

import {
  RadarIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
  SparklesIcon,
  RotateCcwIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useScenario, useSim } from "@/components/simulation-context";
import { SCENARIOS } from "@/lib/scenarios";
import { ViewModeToggle } from "@/components/view-mode-toggle";
import { cn } from "cn";

export function GlobalHeader() {
  const { scenarioId, setScenarioId } = useScenario();
  const sim = useSim();

  const isDisrupted =
    sim.phase === "detecting" ||
    sim.phase === "cascading" ||
    sim.phase === "ready" ||
    sim.phase === "executing";
  const isRecovered = sim.phase === "done";
  const isFailed = sim.phase === "failed";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        {/* Brand & Incident Status */}
        <div className="flex items-center gap-3">
          <div className="relative flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <RadarIcon className="size-4.5 animate-spin [animation-duration:8s]" />
            {isDisrupted && (
              <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-destructive ring-2 ring-background animate-ping" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-sm font-bold tracking-tight">TRIPWIRE</span>
              <span className="hidden rounded-md bg-muted px-1.5 py-0.5 font-mono text-[9px] font-semibold text-muted-foreground sm:inline">
                PS 2 RECOVERY ENGINE
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground hidden sm:block">
              AI Emergency Manager for Connected Travel
            </p>
          </div>
        </div>

        {/* Scenario Quick-Switcher Ribbon */}
        <div className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-muted/40 p-1 overflow-x-auto max-w-full">
          {SCENARIOS.map((s) => {
            const active = s.id === scenarioId;
            return (
              <button
                key={s.id}
                onClick={() => setScenarioId(s.id)}
                className={cn(
                  "flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-medium transition-all",
                  active
                    ? "bg-card text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    active ? (isDisrupted ? "bg-destructive animate-pulse" : "bg-primary") : "bg-muted-foreground/50",
                  )}
                />
                <span>{s.tab}</span>
              </button>
            );
          })}
        </div>

        {/* Right Actions: Status Badge & View Mode Toggle */}
        <div className="flex items-center gap-2.5">
          {/* Status Badge */}
          {isRecovered ? (
            <Badge variant="outline" className="hidden border-accent/40 bg-accent/10 text-accent font-semibold md:flex items-center gap-1 text-xs">
              <ShieldCheckIcon className="size-3.5" />
              <span>ALL FIXED & SAFE</span>
            </Badge>
          ) : isFailed ? (
            <Badge variant="destructive" className="hidden md:flex items-center gap-1 text-xs">
              <RotateCcwIcon className="size-3.5" />
              <span>ZERO-LOSS SAFEGUARD</span>
            </Badge>
          ) : isDisrupted ? (
            <Badge variant="destructive" className="hidden md:flex items-center gap-1 animate-pulse text-xs">
              <ShieldAlertIcon className="size-3.5" />
              <span>ACTION NEEDED</span>
            </Badge>
          ) : (
            <Badge variant="outline" className="hidden border-border bg-card text-muted-foreground md:flex items-center gap-1 text-xs">
              <SparklesIcon className="size-3 text-primary" />
              <span>MONITORING ACTIVE</span>
            </Badge>
          )}

          {/* View Mode Toggle */}
          <ViewModeToggle />
        </div>
      </div>
    </header>
  );
}
