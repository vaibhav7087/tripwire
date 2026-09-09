"use client";

import * as React from "react";
import {
  RotateCcwIcon,
  CheckIcon,
  LoaderCircleIcon,
  XIcon,
  CircleAlertIcon,
  ShieldCheckIcon,
  PlaneTakeoffIcon,
  UsersIcon,
  CalendarIcon,
  LockIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useScenario, useSim } from "@/components/simulation-context";
import { TripGraph } from "@/components/trip-graph";
import { AiBriefing } from "@/components/ai-briefing";
import { OptionsComparator } from "@/components/options-comparator";
import { DigitalVouchers } from "@/components/digital-vouchers";
import { cn } from "cn";

export function DesktopCommandCenter() {
  const { scenario } = useScenario();
  const sim = useSim();

  const isLive =
    sim.phase === "detecting" ||
    sim.phase === "cascading" ||
    sim.phase === "ready" ||
    sim.phase === "executing";
  const isRecovered = sim.phase === "done";
  const isFailed = sim.phase === "failed";

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-6">
      {/* Top Banner / Trip Snapshot */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <PlaneTakeoffIcon className="size-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-lg font-bold tracking-tight text-foreground">
                  {scenario.flightNo} · {scenario.route}
                </h2>
                {isRecovered ? (
                  <Badge variant="outline" className="border-accent/40 bg-accent/10 text-accent font-semibold">
                    ALL FIXED & SAFE
                  </Badge>
                ) : isLive ? (
                  <Badge variant="destructive" className="animate-pulse font-semibold">
                    ACTION NEEDED
                  </Badge>
                ) : (
                  <Badge variant="outline" className="font-mono text-xs">
                    ON SCHEDULE
                  </Badge>
                )}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <PlaneTakeoffIcon className="size-3.5" />
                  {scenario.airline} ({scenario.routeDetail})
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <CalendarIcon className="size-3.5" />
                  {scenario.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <UsersIcon className="size-3.5" />
                  {scenario.pax}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Primary Action */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={sim.reset}
              className="flex items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all active:scale-95 cursor-pointer"
            >
              <RotateCcwIcon className="size-3.5" />
              <span>Reset & Replay</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2-Column Command Center Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* Left Column: Visual Graph + Recovery Options (7 cols) */}
        <div className="space-y-6 lg:col-span-7">
          {/* Visual Dependency Graph */}
          <TripGraph
            scenario={scenario}
            phase={sim.phase}
            previewOptionId={sim.selectedId}
          />

          {/* Options Comparator Grid */}
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <h3 className="font-heading text-sm font-bold tracking-tight text-foreground">
                  CHOOSE YOUR RECOVERY OPTION
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Pick the solution that best fits your schedule and budget. We handle all changes in 1 tap.
                </p>
              </div>
              <Badge variant="outline" className="text-[10px] font-semibold">
                {scenario.options.length} OPTIONS CHECKED
              </Badge>
            </div>

            <OptionsComparator scenario={scenario} sim={sim} />
          </div>
        </div>

        {/* Right Column: AI Briefing + Execution Updates + Digital Vouchers (5 cols) */}
        <div className="space-y-6 lg:col-span-5">
          {/* AI Travel Guardian Briefing */}
          <AiBriefing scenario={scenario} phase={sim.phase} />

          {/* Post-Resolution Digital Vouchers */}
          {isRecovered && (
            <div className="rounded-2xl border border-accent/40 bg-accent/5 p-4 sm:p-5 shadow-sm">
              <DigitalVouchers scenario={scenario} />
            </div>
          )}

          {/* Real-time Resolution Steps */}
          {sim.steps.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between border-b border-border/60 pb-2.5">
                <span className="font-heading text-xs font-bold tracking-tight text-foreground">
                  {isRecovered
                    ? "ALL BOOKINGS UPDATED"
                    : isFailed
                      ? "ROLLBACK SAFEGUARD ACTIVATED"
                      : "UPDATING YOUR BOOKINGS..."}
                </span>
                <Badge
                  variant={isRecovered ? "outline" : isFailed ? "destructive" : "default"}
                  className={cn(
                    "text-[10px] font-semibold",
                    isRecovered && "border-accent/40 bg-accent/10 text-accent",
                  )}
                >
                  {isRecovered
                    ? "DONE"
                    : isFailed
                      ? "SAFEGUARDED"
                      : `${sim.progress}%`}
                </Badge>
              </div>

              <ol className="flex flex-col gap-2">
                {sim.steps.map((s) => (
                  <li
                    key={s.ref}
                    className={cn(
                      "flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-xs transition-all",
                      s.state === "done" && "border-accent/30 bg-accent/5",
                      s.state === "failed" && "border-destructive/60 bg-destructive/10",
                      s.state === "compensated" && "border-border bg-muted/30 opacity-70",
                      s.state === "active" && "border-primary/50 bg-primary/5 ring-1 ring-primary/30",
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {s.state === "done" && (
                        <CheckIcon className="size-3.5 shrink-0 text-accent" />
                      )}
                      {s.state === "active" && (
                        <LoaderCircleIcon className="size-3.5 shrink-0 animate-spin text-primary" />
                      )}
                      {s.state === "failed" && (
                        <XIcon className="size-3.5 shrink-0 text-destructive" />
                      )}
                      {s.state === "compensated" && (
                        <CircleAlertIcon className="size-3.5 shrink-0 text-muted-foreground" />
                      )}
                      {s.state === "todo" && (
                        <span className="size-3.5 shrink-0 rounded-full border border-border" />
                      )}
                      <span className={cn(s.state === "compensated" && "line-through text-muted-foreground", "font-medium")}>
                        {s.label}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>

              {isFailed && (
                <div className="mt-3.5">
                  <Alert variant="destructive">
                    <CircleAlertIcon className="size-4" />
                    <AlertTitle className="text-xs font-bold">
                      Booking Safeguard Protected Your Money
                    </AlertTitle>
                    <AlertDescription className="text-[11px]">
                      A hotel date shift could not be confirmed. We automatically reversed all partial changes. Your original bookings remain intact with zero cancellation fees.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </div>
          )}

          {/* Traveler Peace of Mind Guarantee */}
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm space-y-3">
            <h4 className="font-heading text-xs font-bold tracking-tight text-foreground flex items-center gap-1.5">
              <ShieldCheckIcon className="size-4 text-accent" />
              TRAVEL GUARDIAN PROMISES
            </h4>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-start gap-2">
                <span className="text-accent mt-0.5 font-bold">✓</span>
                <span><strong>Zero Partial Bookings:</strong> If any single leg cannot be rescheduled, all changes roll back automatically.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-accent mt-0.5 font-bold">✓</span>
                <span><strong>Full Regulatory Protection:</strong> Enforces DGCA passenger rights for free rebooking or full cash refunds.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-accent mt-0.5 font-bold">✓</span>
                <span><strong>No Hidden Markups:</strong> All date shifts and transfer re-slots are processed at direct contracted rates.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
