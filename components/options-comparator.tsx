"use client";

import {
  CheckIcon,
  ChevronDownIcon,
  ShieldCheckIcon,
  ClockIcon,
  WalletIcon,
  SparklesIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Scenario, RecoveryOption } from "@/lib/scenarios";
import type { Simulation } from "@/components/use-simulation";
import { cn } from "cn";

interface OptionsComparatorProps {
  scenario: Scenario;
  sim: Simulation;
  className?: string;
}

export function OptionsComparator({ scenario, sim, className }: OptionsComparatorProps) {
  const selectable = sim.phase === "ready" || sim.phase === "failed" || sim.phase === "done";
  const selected: RecoveryOption =
    scenario.options.find((o) => o.id === sim.selectedId) ?? scenario.options[0];

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Comparator Grid */}
      <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-3">
        {scenario.options.map((o) => {
          const isSelected = o.id === sim.selectedId;

          return (
            <div
              key={o.id}
              onClick={() => selectable && sim.setSelectedId(o.id)}
              className={cn(
                "relative flex flex-col justify-between rounded-2xl border p-4 transition-all duration-200 cursor-pointer active:scale-[0.99]",
                isSelected
                  ? "border-primary bg-primary/5 ring-1 ring-primary/40 shadow-sm"
                  : "border-border bg-card hover:border-border/80 hover:bg-card/90",
                !selectable && "pointer-events-none opacity-60",
              )}
            >
              {/* Top Row: Select Badge & Tag */}
              <div>
                <div className="flex items-center justify-between gap-2">
                  <Badge
                    variant={
                      o.tag === "RECOMMENDED"
                        ? "default"
                        : o.tag === "FASTEST"
                          ? "secondary"
                          : "outline"
                    }
                    className="font-mono text-[10px] uppercase font-semibold"
                  >
                    {o.tag}
                  </Badge>

                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "flex size-5 items-center justify-center rounded-full border transition-all",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-transparent",
                      )}
                    >
                      <CheckIcon className="size-3" />
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {isSelected ? "SELECTED" : "CLICK TO CHOOSE"}
                    </span>
                  </div>
                </div>

                {/* Option Title */}
                <h4 className="mt-2.5 font-heading text-sm font-bold text-foreground leading-snug">
                  {o.title}
                </h4>

                {/* Key Metric Tags */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[11px] font-bold",
                      o.costDelta === 0
                        ? "bg-muted text-foreground"
                        : o.costDelta < 0
                          ? "bg-accent/15 text-accent"
                          : "bg-amber-500/15 text-amber-500",
                    )}
                  >
                    <WalletIcon className="size-3" />
                    {o.costNote}
                  </span>

                  <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                    <ClockIcon className="size-3 text-primary" />
                    {o.timeSaved}
                  </span>
                </div>

                {/* Reasoning Points */}
                <ul className="mt-3.5 flex flex-col gap-1.5 border-t border-border/60 pt-3">
                  {o.reasoning.map((r, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground leading-relaxed">
                      <span className="text-primary mt-0.5 text-[10px]">▸</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>

                {/* Policy Accordion */}
                <div className="mt-3">
                  <details className="group rounded-xl border border-border/60 bg-muted/20 p-2 text-xs">
                    <summary className="flex cursor-pointer items-center justify-between font-mono text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                      <span className="flex items-center gap-1">
                        <ShieldCheckIcon className="size-3 text-accent" />
                        Policy: {o.policySource}
                      </span>
                      <ChevronDownIcon className="size-3 transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="mt-2 font-mono text-[11px] text-muted-foreground/90 pl-1">
                      {o.policyCite}
                    </p>
                  </details>
                </div>
              </div>

                {/* Match Score */}
                <div className="mt-4 border-t border-border/50 pt-3">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1 font-medium">
                      <SparklesIcon className="size-3 text-primary" />
                      Plan Match
                    </span>
                    <span className="font-mono font-bold text-foreground">
                      {o.confidence}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${o.confidence}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 1-Tap Execution CTA */}
        {selectable && sim.phase !== "done" && (
          <Dialog>
            <DialogTrigger asChild>
              <div className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-sm font-bold text-primary-foreground shadow-md transition-all active:scale-[0.98] hover:opacity-95">
                <CheckIcon className="size-4" />
                <span>Approve “{selected.title}” · Fix My Trip</span>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Updates to Your Trip</DialogTitle>
                <DialogDescription>
                  Tripwire will immediately update {selected.plan.length} reservations across your hotel,
                  flight, and transfer. Backed by our zero-loss guarantee: if any booking cannot be confirmed,
                  all changes are automatically cancelled.
                </DialogDescription>
              </DialogHeader>

            <div className="my-2 rounded-xl border border-border bg-muted/30 p-3">
              <p className="font-bold text-xs text-foreground mb-1.5">
                Staged Execution Plan ({selected.plan.length} steps):
              </p>
              <ul className="flex flex-col gap-1 text-xs text-muted-foreground font-mono">
                {selected.plan.map((p, i) => (
                  <li key={p.ref} className="flex items-center justify-between gap-2">
                    <span>{i + 1}. {p.label}</span>
                    <span className="text-[10px] text-muted-foreground/70">{p.ref}</span>
                  </li>
                ))}
              </ul>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <div className="cursor-pointer rounded-xl border border-border px-4 py-2.5 text-sm font-bold text-center">
                  Review More Options
                </div>
              </DialogClose>
              <DialogClose asChild>
                <div
                  onClick={sim.execute}
                  className="cursor-pointer rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground text-center"
                >
                  <CheckIcon className="mr-1.5 inline size-4" />
                  Confirm & Execute Recovery
                </div>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
