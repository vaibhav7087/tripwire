"use client";

import Link from "next/link";
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckIcon,
  PlayIcon,
  TriangleAlertIcon,
  UsersIcon,
  PlaneTakeoffIcon,
  ZapIcon,
  BrainCircuitIcon,
  MessageSquareIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AppShell } from "@/components/app-shell";
import { AiBriefing } from "@/components/ai-briefing";
import { useScenario, useSim } from "@/components/simulation-context";
import { cn } from "cn";

const PIPELINE = [
  { icon: ZapIcon, name: "Spotting the problem", desc: "We scan your flight data 24/7" },
  { icon: BrainCircuitIcon, name: "Figuring out the ripple effect", desc: "How it hits your hotel, pickup, tour…" },
  { icon: MessageSquareIcon, name: "Finding your best options", desc: "Checked against airline & hotel policies" },
  { icon: ShieldCheckIcon, name: "Checking the fine print", desc: "Fare rules, cancellation windows, penalties" },
] as const;

export default function AnalyzePage() {
  const { scenario } = useScenario();
  const sim = useSim();
  const live =
    sim.phase === "detecting" ||
    sim.phase === "cascading" ||
    sim.phase === "ready" ||
    sim.phase === "executing";
  const recovered = sim.phase === "done";
  const pipelineIdx =
    sim.phase === "detecting" ? 0
    : sim.phase === "cascading" ? 1
    : sim.phase === "ready" ? 2
    : sim.phase === "done" || sim.phase === "failed" ? 3
    : -1;

  return (
    <AppShell>
      <div className="flex flex-col gap-5">
        {/* Back nav */}
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs text-muted-foreground active:text-foreground"
        >
          <ArrowLeftIcon className="size-3.5" />
          Your trips
        </Link>

        {/* Trip card */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PlaneTakeoffIcon className="size-4 text-muted-foreground" />
              <p className="font-mono text-sm font-bold">
                {scenario.flightNo} · {scenario.airline}
              </p>
            </div>
            {recovered ? (
              <Badge variant="success">RECOVERED</Badge>
            ) : live ? (
              <Badge variant="destructive">DISRUPTED</Badge>
            ) : (
              <Badge variant="outline">ON TIME</Badge>
            )}
          </div>

          <p className="mb-4 text-xs text-muted-foreground">
            {scenario.routeDetail} · {scenario.date}
          </p>

          {/* Dep / Arr */}
          <div className="flex items-end justify-between">
            <div>
              <p className="font-mono text-3xl font-bold">{scenario.schedDep}</p>
              <p className="mt-1 text-[10px] tracking-widest text-muted-foreground">
                {scenario.route.split("→")[0]?.trim()} DEP
              </p>
            </div>
            <div className="flex flex-1 items-center gap-2 px-3 pb-2">
              <Separator className="flex-1" />
              <span className="font-mono text-[10px] text-muted-foreground">
                {scenario.route}
              </span>
              <Separator className="flex-1" />
            </div>
            <div className="text-right">
              <p className="font-mono text-3xl font-bold">{scenario.schedArr}</p>
              <p className="mt-1 text-[10px] tracking-widest text-muted-foreground">
                ARR
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <UsersIcon className="size-3.5" />
            {scenario.pax}
          </div>

          {/* Disruption alert — plain language */}
          {live && (
            <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
              <div className="flex items-start gap-3">
                <TriangleAlertIcon className="mt-0.5 size-5 shrink-0 text-destructive" />
                <div>
                  <p className="text-sm font-bold text-destructive">
                    {scenario.triggerTitle}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {scenario.triggerDetail}
                  </p>
                  <p className="mt-2 text-[11px] font-medium text-muted-foreground/80">
                    We spotted this at {scenario.detectedAt} — typically airlines tell you ~2h before departure.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* AI Briefing with Live Urgency Countdown */}
        {live && <AiBriefing scenario={scenario} phase={sim.phase} />}

        {/* What we're doing — friendly pipeline */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="mb-4 text-xs font-semibold tracking-widest text-muted-foreground">
            WHAT WE&apos;RE DOING RIGHT NOW
          </p>
          <div className="flex flex-col gap-0">
            {PIPELINE.map((step, i) => {
              const done = pipelineIdx >= i;
              const active = pipelineIdx === i;
              return (
                <div key={step.name} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                        done
                          ? "border-accent bg-accent text-accent-foreground"
                          : active
                            ? "animate-pulse border-primary bg-primary text-primary-foreground"
                            : "border-border text-muted-foreground",
                      )}
                    >
                      {done ? <CheckIcon className="size-4" /> : <step.icon className="size-4" />}
                    </span>
                    {i < PIPELINE.length - 1 && (
                      <span
                        className={cn(
                          "w-px flex-1 min-h-6",
                          done ? "bg-accent" : "bg-border",
                        )}
                      />
                    )}
                  </div>
                  <div className="py-2">
                    <p
                      className={cn(
                        "text-sm font-bold",
                        !done && "text-muted-foreground",
                      )}
                    >
                      {step.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        {sim.phase === "idle" ? (
          <div
            onClick={sim.run}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-sm font-bold text-primary-foreground transition-all active:scale-[0.98]"
          >
            <PlayIcon className="size-4" />
            Start scanning
          </div>
        ) : sim.phase === "ready" ? (
          <Link href="/cascade" className="block">
            <div className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-sm font-bold text-primary-foreground transition-all active:scale-[0.98]">
              See what&apos;s affected
              <ArrowRightIcon className="size-4" />
            </div>
          </Link>
        ) : sim.phase === "done" || sim.phase === "failed" ? (
          <div className="flex gap-3">
            <div
              onClick={sim.reset}
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-border px-4 py-3 text-sm font-bold transition-all active:scale-[0.98]"
            >
              Start over
            </div>
            <Link href="/cascade" className="block flex-1">
              <div className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border px-4 py-3 text-sm font-bold transition-all active:scale-[0.98]">
                View details
              </div>
            </Link>
          </div>
        ) : (
          <div className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border px-6 py-4 text-sm font-bold text-muted-foreground">
            Scanning your trip…
          </div>
        )}
      </div>
    </AppShell>
  );
}
