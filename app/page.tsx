"use client";

import Link from "next/link";
import {
  ArrowRightIcon,
  RadarIcon,
  PlaneTakeoffIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AppShell } from "@/components/app-shell";
import { useScenario, useSim } from "@/components/simulation-context";
import { SCENARIOS } from "@/lib/scenarios";
import { cn } from "cn";

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function HomePage() {
  const { scenarioId, setScenarioId } = useScenario();
  const sim = useSim();

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        {/* Greeting */}
        <header className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <RadarIcon className="size-5" />
          </span>
          <div>
            <h1 className="text-lg font-bold">
              {greeting()}, Gaurangi
            </h1>
            <p className="text-[11px] tracking-widest text-muted-foreground">
              TRIPWIRE · YOUR TRAVEL GUARDIAN
            </p>
          </div>
        </header>

        {/* Status banner */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <ShieldCheckIcon className="size-5 text-accent" />
            <div className="flex-1">
              <p className="text-sm font-bold">
                We&apos;re watching{" "}
                <span className="font-mono text-primary">
                  {SCENARIOS.length} trips
                </span>{" "}
                for you
              </p>
              <p className="text-xs text-muted-foreground">
                If anything changes, we&apos;ll know before the airline tells you.
              </p>
            </div>
            <Badge variant={sim.phase !== "idle" ? "default" : "outline"}>
              {sim.phase !== "idle" ? "● ALERT" : "○ ALL GOOD"}
            </Badge>
          </div>
        </div>

        {/* Trip cards */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold tracking-widest text-muted-foreground">
            YOUR TRIPS
          </p>
          {SCENARIOS.map((s) => {
            const active = s.id === scenarioId;
            return (
              <button
                key={s.id}
                onClick={() => setScenarioId(s.id)}
                className={cn(
                  "w-full rounded-2xl border p-4 text-left transition-all active:scale-[0.98]",
                  active
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex size-11 shrink-0 items-center justify-center rounded-2xl",
                        active
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      <PlaneTakeoffIcon className="size-5" />
                    </span>
                    <div>
                      <p className="text-sm font-bold">
                        {s.route}
                      </p>
                      <p className="font-mono text-xs text-muted-foreground">
                        {s.flightNo} · {s.schedDep} → {s.schedArr}
                      </p>
                    </div>
                  </div>
                  <ArrowRightIcon
                    className={cn(
                      "mt-1 size-4 shrink-0",
                      active ? "text-primary" : "text-muted-foreground",
                    )}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                  <span>{s.airline} · {s.pax}</span>
                  <span>{s.date}</span>
                </div>

                {active && (
                  <div className="mt-3 rounded-xl bg-destructive/10 px-3 py-2.5">
                    <p className="text-xs font-bold text-destructive">
                      ⚠ {s.triggerTitle}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      Detected at {s.detectedAt} — we&apos;re on it.
                    </p>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <Link href="/analyze" className="block">
          <div className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-sm font-bold text-primary-foreground transition-all active:scale-[0.98]">
            See what&apos;s happening
            <ArrowRightIcon className="size-4" />
          </div>
        </Link>
      </div>
    </AppShell>
  );
}
