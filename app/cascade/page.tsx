"use client";

import Link from "next/link";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PlaneIcon,
  BedDoubleIcon,
  CarFrontIcon,
  TicketIcon,
  PlaneTakeoffIcon,
  CircleAlertIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AppShell } from "@/components/app-shell";
import { TripGraph } from "@/components/trip-graph";
import { useScenario, useSim } from "@/components/simulation-context";
import type { LegKind, LegStatus } from "@/lib/scenarios";
import { cn } from "cn";

const KIND_ICON: Record<LegKind, typeof PlaneIcon> = {
  flight: PlaneIcon,
  hotel: BedDoubleIcon,
  pickup: CarFrontIcon,
  activity: TicketIcon,
  return: PlaneTakeoffIcon,
};

const KIND_LABEL: Record<LegKind, string> = {
  flight: "Flight",
  hotel: "Hotel",
  pickup: "Transfer",
  activity: "Activity",
  return: "Return",
};

function statusInfo(status: LegStatus, recovered: boolean) {
  if (recovered && (status === "atrisk" || status === "delayed" || status === "cancelled")) {
    return { label: "Fixed", color: "bg-accent/15 text-accent border-accent/30" };
  }
  switch (status) {
    case "delayed":
      return { label: "Delayed", color: "bg-destructive/15 text-destructive border-destructive/30" };
    case "cancelled":
      return { label: "Cancelled", color: "bg-destructive/15 text-destructive border-destructive/30" };
    case "atrisk":
      return { label: "At risk", color: "bg-primary/15 text-primary border-primary/30" };
    case "ontime":
      return { label: "On time", color: "bg-muted text-muted-foreground border-border" };
    case "rebooked":
      return { label: "Fixed", color: "bg-accent/15 text-accent border-accent/30" };
  }
}

export default function CascadePage() {
  const { scenario } = useScenario();
  const sim = useSim();
  const recovered = sim.phase === "done";
  const loading = sim.phase === "cascading";
  const hasData = sim.phase !== "idle" && sim.phase !== "detecting";
  const affected = hasData
    ? scenario.cascade.filter((l) => l.status !== "ontime").length
    : 0;

  return (
    <AppShell>
      <div className="flex flex-col gap-5">
        {/* Back nav */}
        <Link
          href="/analyze"
          className="flex items-center gap-1.5 text-xs text-muted-foreground active:text-foreground"
        >
          <ArrowLeftIcon className="size-3.5" />
          Back to status
        </Link>

        {/* Visual Trip Graph */}
        <TripGraph
          scenario={scenario}
          phase={sim.phase}
          previewOptionId={sim.selectedId}
        />

        {/* Header */}
        <div>
          <h2 className="text-base font-bold">
            {hasData
              ? `${affected} part${affected !== 1 ? "s" : ""} of your trip need${affected === 1 ? "s" : ""} attention`
              : "What's affected"}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {hasData
              ? "We checked every leg of your trip for knock-on effects."
              : "Run the scan to see how the disruption ripples through your trip."}
          </p>
        </div>

        {/* Legs */}
        {!hasData ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center">
            <CircleAlertIcon className="size-10 text-muted-foreground/30" />
            <div>
              <p className="text-sm font-bold">Nothing disrupted yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                We&apos;ll check your flight, hotel, pickup, and activities as soon as we spot something.
              </p>
            </div>
          </div>
        ) : loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-2xl border border-border bg-muted/30"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {scenario.cascade.map((leg) => {
              const Icon = KIND_ICON[leg.kind];
              const info = statusInfo(leg.status, recovered);
              return (
                <div
                  key={leg.id}
                  className="rounded-2xl border border-border bg-card p-4"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "flex size-11 shrink-0 items-center justify-center rounded-2xl border",
                        info.color,
                      )}
                    >
                      <Icon className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-bold">{leg.leg}</p>
                          <p className="font-mono text-[10px] text-muted-foreground">
                            {KIND_LABEL[leg.kind]} · {leg.scheduled}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn("shrink-0 border text-[10px]", info.color)}
                        >
                          {info.label}
                        </Badge>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {leg.impact}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CTA */}
        {hasData && !loading && (
          <Link href="/options" className="block">
            <div className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-sm font-bold text-primary-foreground transition-all active:scale-[0.98]">
              See how we&apos;ll fix it
              <ArrowRightIcon className="size-4" />
            </div>
          </Link>
        )}
      </div>
    </AppShell>
  );
}
