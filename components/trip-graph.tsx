"use client";

import * as React from "react";
import {
  PlaneIcon,
  BedDoubleIcon,
  CarFrontIcon,
  TicketIcon,
  PlaneTakeoffIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  ArrowRightIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Scenario, LegKind, LegStatus } from "@/lib/scenarios";
import type { Phase } from "@/components/use-simulation";
import { cn } from "cn";

interface TripGraphProps {
  scenario: Scenario;
  phase: Phase;
  previewOptionId?: string;
  className?: string;
}

const KIND_ICON: Record<LegKind, typeof PlaneIcon> = {
  flight: PlaneIcon,
  hotel: BedDoubleIcon,
  pickup: CarFrontIcon,
  activity: TicketIcon,
  return: PlaneTakeoffIcon,
};

export function TripGraph({ scenario, phase, previewOptionId, className }: TripGraphProps) {
  const isRecovered = phase === "done";
  const isDisrupted =
    phase === "detecting" ||
    phase === "cascading" ||
    phase === "ready" ||
    phase === "executing";

  // Check which option is previewed or active
  const option = scenario.options.find((o) => o.id === previewOptionId) || scenario.options[0];

  return (
    <div className={cn("rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm", className)}>
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-primary animate-ping" />
            <h3 className="font-heading text-sm font-bold tracking-tight text-foreground">
              HOW YOUR TRIP IS CONNECTED
            </h3>
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {isRecovered
              ? "All reservations reconciled · Your schedule is protected"
              : isDisrupted
                ? "Here is how this delay impacts your hotel, pickup, and activities downstream"
                : "Continuous monitoring for your flight, hotel, and activities"}
          </p>
        </div>
        <Badge
          variant={isRecovered ? "outline" : isDisrupted ? "destructive" : "outline"}
          className={cn(
            "text-[10px] font-semibold tracking-wide uppercase",
            isRecovered && "border-accent/40 bg-accent/10 text-accent",
          )}
        >
          {isRecovered
            ? "ALL FIXED & SAFE"
            : isDisrupted
              ? "ACTION NEEDED"
              : "ON SCHEDULE"}
        </Badge>
      </div>

      {/* Nodes Graph Container */}
      <div className="relative overflow-x-auto pb-2 pt-1 board-scroll">
        <div className="flex min-w-[620px] items-center justify-between gap-2">
          {scenario.cascade.map((leg, index) => {
            const Icon = KIND_ICON[leg.kind];
            const isDelayedOrCancelled = leg.status === "delayed" || leg.status === "cancelled";
            const isAtRisk = leg.status === "atrisk";
            const isSafe = leg.status === "ontime";

            // Visual state determination
            let nodeState: "normal" | "danger" | "warning" | "recovered" = "normal";
            if (isRecovered) {
              nodeState = "recovered";
            } else if (isDisrupted) {
              if (isDelayedOrCancelled) nodeState = "danger";
              else if (isAtRisk) nodeState = "warning";
              else nodeState = "normal";
            }

            // Custom recovery badges per node
            let recoveryNote = "";
            let breachNote = "";

            if (leg.kind === "flight") {
              breachNote = scenario.triggerTitle;
              recoveryNote = option.id === "b" ? "Re-routed early" : "Tracked & buffered";
            } else if (leg.kind === "hotel") {
              breachNote = "Breaches 23:00 cutoff (₹4,500 fee)";
              recoveryNote = "Late check-in waived (02:00)";
            } else if (leg.kind === "pickup") {
              breachNote = "3h wait timeout / cancel";
              recoveryNote = "Re-slotted (00:15)";
            } else if (leg.kind === "activity") {
              breachNote = "Wakeup rest < 3.5h";
              recoveryNote = option.id === "c" ? "Refunded (−₹1,800)" : "Rescheduled (06:30)";
            } else if (leg.kind === "return") {
              recoveryNote = "Intact & held";
            }

            return (
              <React.Fragment key={leg.id}>
                {/* Node Card */}
                <div
                  className={cn(
                    "group relative flex-1 min-w-[130px] rounded-xl border p-3 transition-all duration-300",
                    nodeState === "danger" &&
                      "border-destructive/60 bg-destructive/10 ring-1 ring-destructive/40 shadow-xs",
                    nodeState === "warning" &&
                      "border-amber-500/50 bg-amber-500/10 ring-1 ring-amber-500/30",
                    nodeState === "recovered" &&
                      "border-accent/50 bg-accent/10 ring-1 ring-accent/30",
                    nodeState === "normal" && "border-border bg-card/80",
                  )}
                >
                  {/* Top Kind & Status Indicator */}
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={cn(
                        "flex size-7 items-center justify-center rounded-lg border",
                        nodeState === "danger" && "border-destructive/40 bg-destructive/20 text-destructive",
                        nodeState === "warning" && "border-amber-500/40 bg-amber-500/20 text-amber-500",
                        nodeState === "recovered" && "border-accent/40 bg-accent/20 text-accent",
                        nodeState === "normal" && "border-border bg-muted text-muted-foreground",
                      )}
                    >
                      <Icon className="size-3.5" />
                    </span>

                    <span
                      className={cn(
                        "text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider",
                        nodeState === "danger" && "bg-destructive text-destructive-foreground",
                        nodeState === "warning" && "bg-amber-500/20 text-amber-500",
                        nodeState === "recovered" && "bg-accent/20 text-accent",
                        nodeState === "normal" && "bg-muted text-muted-foreground",
                      )}
                    >
                      {nodeState === "recovered"
                        ? "FIXED"
                        : nodeState === "danger"
                          ? leg.status === "cancelled" ? "CANCELLED" : "DELAYED"
                          : nodeState === "warning"
                            ? "AT RISK"
                            : "ON TIME"}
                    </span>
                  </div>

                  {/* Title & Scheduled */}
                  <p className="font-bold text-xs leading-tight text-foreground truncate" title={leg.leg}>
                    {leg.leg.split("·")[0]?.trim()}
                  </p>
                  <p className="font-mono text-[10px] text-muted-foreground mt-0.5 truncate">
                    {leg.scheduled}
                  </p>

                  {/* Bottom Impact / Recovery Callout */}
                  <div className="mt-2 pt-2 border-t border-border/50 text-[10px] leading-tight">
                    {nodeState === "recovered" ? (
                      <span className="flex items-center gap-1 text-accent font-medium">
                        <CheckCircle2Icon className="size-3 shrink-0" />
                        <span className="truncate">{recoveryNote}</span>
                      </span>
                    ) : nodeState === "danger" || nodeState === "warning" ? (
                      <span className="flex items-center gap-1 text-destructive font-medium">
                        <AlertTriangleIcon className="size-3 shrink-0 text-destructive" />
                        <span className="truncate">{breachNote}</span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground flex items-center gap-1">
                        <ShieldCheckIcon className="size-3 text-muted-foreground" />
                        <span>Protected</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Connecting Arrow with Flow Ripple Animation */}
                {index < scenario.cascade.length - 1 && (
                  <div className="relative flex items-center justify-center shrink-0 w-5">
                    <div
                      className={cn(
                        "h-0.5 w-full transition-colors duration-500",
                        isRecovered
                          ? "bg-accent"
                          : isDisrupted
                            ? "bg-gradient-to-r from-destructive via-amber-500 to-border animate-pulse"
                            : "bg-border",
                      )}
                    />
                    <ArrowRightIcon
                      className={cn(
                        "absolute size-3 -right-0.5 transition-colors",
                        isRecovered
                          ? "text-accent"
                          : isDisrupted
                            ? "text-amber-500"
                            : "text-muted-foreground/60",
                      )}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Disruption Ripple Summary Banner */}
      {isDisrupted && !isRecovered && (
        <div className="mt-3.5 flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-xs">
          <AlertTriangleIcon className="size-4 shrink-0 text-destructive mt-0.5" />
          <div className="flex-1">
            <span className="font-bold text-destructive">
              Knock-On Impact: {scenario.cascade.filter((c) => c.status !== "ontime").length - 1} bookings need attention
            </span>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Because flight {scenario.flightNo} is delayed, your hotel check-in and transfer window must be adjusted now to avoid no-show fees. Pick an option below to resolve all bookings in 1 tap.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
