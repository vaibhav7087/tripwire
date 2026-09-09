"use client";

import * as React from "react";
import {
  ShieldAlertIcon,
  ClockIcon,
  ShieldCheckIcon,
  SparklesIcon,
  WalletIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Scenario } from "@/lib/scenarios";
import type { Phase } from "@/components/use-simulation";
import { cn } from "cn";

interface AiBriefingProps {
  scenario: Scenario;
  phase: Phase;
  className?: string;
}

export function AiBriefing({ scenario, phase, className }: AiBriefingProps) {
  // Urgency countdown timer (e.g. 1h 28m counting down)
  const [secondsLeft, setSecondsLeft] = React.useState(5320);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 5320));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
  };

  const isRecovered = phase === "done";
  const isDisrupted =
    phase === "detecting" ||
    phase === "cascading" ||
    phase === "ready" ||
    phase === "executing";

  // Friendly human descriptions per scenario
  let alertSummary = "";
  if (scenario.id === "ai202") {
    alertSummary =
      "Your flight is running +3h 05m late. If left unhandled, you will miss your hotel's 23:00 check-in window (triggering a ₹4,500 no-show fee) and strand your 21:15 cab pickup. We have arranged 3 simple ways to keep your trip on track.";
  } else if (scenario.id === "xtra") {
    alertSummary =
      "Your morning IndiGo flight has been cancelled. This affects your Bangalore hotel check-in and 14:00 client workshop. We have already secured alternative options to save your schedule.";
  } else {
    alertSummary =
      "Your inbound flight delay shrinks your Delhi connection to just 22 minutes (below the 45-minute minimum). We have protected alternate flights to prevent you from getting stranded at the airport.";
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-4 sm:p-5 shadow-sm transition-all",
        isRecovered
          ? "border-accent/40 bg-accent/5"
          : isDisrupted
            ? "border-destructive/30 bg-destructive/5"
            : "border-border bg-card",
        className,
      )}
    >
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
            <ShieldAlertIcon className="size-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-xs font-bold tracking-tight">
                AI TRAVEL GUARDIAN ALERT
              </span>
              <span className="rounded-md bg-muted/60 px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                EARLY NOTICE
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Spotted ~2 hours before official airline notifications
            </p>
          </div>
        </div>

        {isDisrupted && !isRecovered && (
          <div className="flex items-center gap-1.5 rounded-lg border border-destructive/40 bg-destructive/10 px-2.5 py-1 text-xs font-mono font-semibold text-destructive">
            <ClockIcon className="size-3.5 animate-spin [animation-duration:10s]" />
            <span>CUTOFF LOCK: {formatCountdown(secondsLeft)}</span>
          </div>
        )}

        {isRecovered && (
          <Badge variant="outline" className="border-accent/40 bg-accent/10 text-accent font-semibold text-[10px]">
            TRIP PROTECTED & RESOLVED
          </Badge>
        )}
      </div>

      {/* Briefing Text */}
      <div className="mt-3.5">
        <h4 className="font-heading text-sm font-bold text-foreground">
          {isRecovered
            ? "All bookings updated successfully!"
            : isDisrupted
              ? `${scenario.triggerTitle}`
              : `Watching your flight ${scenario.flightNo}`}
        </h4>

        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
          {isRecovered
            ? `Your trip is fully back on schedule. ${scenario.resolvedNote}. All supplier updates have been confirmed with zero cancellation penalties.`
            : isDisrupted
              ? alertSummary
              : `We are monitoring your flight, hotel check-in, and airport pickup around the clock. If anything changes, we'll notify you immediately.`}
        </p>
      </div>

      {/* Key Metrics / Value Impact */}
      {isDisrupted && (
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border/50 pt-3">
          <div className="rounded-xl border border-border/60 bg-card/60 p-2.5">
            <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
              <WalletIcon className="size-3 text-destructive" />
              Fees Prevented
            </span>
            <p className="mt-1 font-mono text-xs font-bold text-destructive">
              {scenario.id === "ai202" ? "₹6,300" : scenario.id === "xtra" ? "₹8,900" : "₹3,400"}
            </p>
          </div>

          <div className="rounded-xl border border-border/60 bg-card/60 p-2.5">
            <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
              <ClockIcon className="size-3 text-primary" />
              Time Saved
            </span>
            <p className="mt-1 font-mono text-xs font-bold text-primary">
              ~3 to 5 Hours
            </p>
          </div>

          <div className="rounded-xl border border-border/60 bg-card/60 p-2.5">
            <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
              <SparklesIcon className="size-3 text-accent" />
              Effort Needed
            </span>
            <p className="mt-1 font-mono text-xs font-bold text-accent">
              1-Tap Fix
            </p>
          </div>
        </div>
      )}

      {/* Regulatory & Safety Shield Badges */}
      <div className="mt-3.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-0.5 font-medium">
          <ShieldCheckIcon className="size-3 text-accent" />
          Aviation Passenger Rights (DGCA)
        </span>
        <span className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-0.5 font-medium">
          <ShieldCheckIcon className="size-3 text-accent" />
          Contracted Cab Rate (No Surge)
        </span>
        <span className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-0.5 font-medium">
          <ShieldCheckIcon className="size-3 text-accent" />
          Free 24h Hotel Shift
        </span>
      </div>
    </div>
  );
}
