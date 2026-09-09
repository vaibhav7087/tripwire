"use client";

import Link from "next/link";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  ListChecksIcon,
  ChevronDownIcon,
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
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { AppShell } from "@/components/app-shell";
import { TripGraph } from "@/components/trip-graph";
import { AiBriefing } from "@/components/ai-briefing";
import { useScenario, useSim } from "@/components/simulation-context";
import { cn } from "cn";

export default function OptionsPage() {
  const { scenario } = useScenario();
  const sim = useSim();
  const selectable = sim.phase === "ready" || sim.phase === "failed" || sim.phase === "done";
  const selected = scenario.options.find((o) => o.id === sim.selectedId) ?? scenario.options[0];

  if (sim.phase === "idle" || sim.phase === "detecting" || sim.phase === "cascading") {
    return (
      <AppShell>
        <div className="flex flex-col gap-5">
          <Link
            href="/cascade"
            className="flex items-center gap-1.5 text-xs text-muted-foreground active:text-foreground"
          >
            <ArrowLeftIcon className="size-3.5" />
            Back to impact
          </Link>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ListChecksIcon />
              </EmptyMedia>
              <EmptyTitle>We&apos;re still figuring out your options</EmptyTitle>
              <EmptyDescription>
                Once we understand the full impact, we&apos;ll find the best ways to fix your trip.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-5">
        {/* Back nav */}
        <Link
          href="/cascade"
          className="flex items-center gap-1.5 text-xs text-muted-foreground active:text-foreground"
        >
          <ArrowLeftIcon className="size-3.5" />
          Back to impact
        </Link>

        {/* AI Incident Briefing */}
        <AiBriefing scenario={scenario} phase={sim.phase} />

        {/* Visual Graph Preview */}
        <TripGraph
          scenario={scenario}
          phase={sim.phase}
          previewOptionId={sim.selectedId}
        />

        {/* Header */}
        <div>
          <h2 className="text-base font-bold">
            {sim.phase === "done"
              ? "Your trip is fixed!"
              : "Here's what we can do"}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {sim.phase === "done"
              ? "All changes have been applied to your bookings."
              : `We checked policies across ${scenario.options.length} options. Pick the one that works for you.`}
          </p>
        </div>

        {/* Options list */}
        <div className="flex flex-col gap-3">
          {scenario.options.map((o) => {
            const active = o.id === sim.selectedId;
            return (
              <button
                key={o.id}
                onClick={() => selectable && sim.setSelectedId(o.id)}
                className={cn(
                  "w-full rounded-2xl border p-4 text-left transition-all active:scale-[0.98]",
                  active
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card",
                  !selectable && "pointer-events-none opacity-60",
                )}
              >
                {/* Top row */}
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-transparent",
                    )}
                  >
                    <CheckIcon className="size-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold leading-tight">{o.title}</p>
                    <div className="mt-1.5 flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-[10px]">
                        {o.tag}
                      </Badge>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {o.costNote}
                      </span>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {o.timeSaved}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Reasoning — plain language */}
                <ul className="mt-3 flex flex-col gap-1.5 pl-9">
                  {o.reasoning.map((r, i) => (
                    <li key={i} className="flex gap-2 text-xs text-muted-foreground">
                      <span className="text-primary">▸</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>

                {/* Policy + Plan */}
                <div className="mt-3 pl-9">
                  <details className="group">
                    <summary className="flex cursor-pointer items-center gap-1.5 text-[10px] font-semibold tracking-widest text-muted-foreground">
                      <ChevronDownIcon className="size-3 transition-transform group-open:rotate-180" />
                      HOW WE KNOW THIS WORKS
                    </summary>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {o.policyCite}
                    </p>
                  </details>
                  <details className="group mt-2">
                    <summary className="flex cursor-pointer items-center gap-1.5 text-[10px] font-semibold tracking-widest text-muted-foreground">
                      <ChevronDownIcon className="size-3 transition-transform group-open:rotate-180" />
                      WHAT WE&apos;LL DO · {o.plan.length} STEPS
                    </summary>
                    <ol className="mt-2 flex flex-col gap-1.5">
                      {o.plan.map((p, i) => (
                        <li
                          key={p.ref}
                          className="flex items-baseline justify-between gap-2 text-xs"
                        >
                          <span className="text-muted-foreground">
                            {i + 1}. {p.label}
                          </span>
                          <span className="tnum shrink-0 font-mono text-[10px] text-muted-foreground">
                            {p.ref}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </details>
                </div>

                {/* Confidence */}
                <div className="mt-3 pl-9">
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>How confident we are</span>
                    <span className="tnum font-mono font-bold text-foreground">
                      {o.confidence}%
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${o.confidence}%` }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Approve CTA */}
        {selectable && sim.phase !== "done" && (
          <Dialog>
            <DialogTrigger asChild>
              <div className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-sm font-bold text-primary-foreground transition-all active:scale-[0.98]">
                <CheckIcon className="size-4" />
                Approve — we&apos;ll handle everything
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm this plan?</DialogTitle>
                <DialogDescription>
                  We&apos;ll execute {selected.plan.length} changes for you with
                  automatic rollback if anything fails. {selected.costNote} ·{" "}
                  {selected.timeSaved}.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <div className="cursor-pointer rounded-xl border border-border px-4 py-2.5 text-sm font-bold">
                    Not now
                  </div>
                </DialogClose>
                <DialogClose asChild>
                  <div
                    onClick={sim.execute}
                    className="cursor-pointer rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground"
                  >
                    <CheckIcon className="mr-2 inline size-4" />
                    Confirm & fix my trip
                  </div>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Post-execution nav */}
        {(sim.phase === "done" || sim.phase === "failed") && (
          <Link href="/execute" className="block">
            <div className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-sm font-bold text-primary-foreground transition-all active:scale-[0.98]">
              See what we did
              <ArrowRightIcon className="size-4" />
            </div>
          </Link>
        )}
      </div>
    </AppShell>
  );
}
