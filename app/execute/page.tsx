"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  CheckIcon,
  CircleAlertIcon,
  CircleCheckIcon,
  LoaderCircleIcon,
  XIcon,
  FlaskConicalIcon,
  RotateCcwIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AppShell } from "@/components/app-shell";
import { DigitalVouchers } from "@/components/digital-vouchers";
import { useScenario, useSim } from "@/components/simulation-context";
import { cn } from "cn";

export default function ExecutePage() {
  const { scenario } = useScenario();
  const sim = useSim();
  const logRef = React.useRef<HTMLDivElement>(null);
  const active = sim.phase === "executing";
  const done = sim.phase === "done";
  const failed = sim.phase === "failed";

  React.useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [sim.log.length]);

  return (
    <AppShell>
      <div className="flex flex-col gap-5">
        {/* Back nav */}
        <Link
          href="/options"
          className="flex items-center gap-1.5 text-xs text-muted-foreground active:text-foreground"
        >
          <ArrowLeftIcon className="size-3.5" />
          Back to options
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold">
              {done ? "All set!" : failed ? "Something went wrong" : "Fixing your trip"}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {done
                ? "Everything's been updated. Here's what changed."
                : failed
                  ? "We hit a snag — but nothing was half-booked. Let's try another option."
                  : active
                    ? "Working on it… we'll let you know when it's done."
                    : "Approve a plan to start fixing your trip."}
            </p>
          </div>
          <Badge
            variant={
              done ? "success" : failed ? "destructive" : active ? "default" : "outline"
            }
          >
            {done ? "DONE" : failed ? "FAILED" : active ? "WORKING" : "IDLE"}
          </Badge>
        </div>

        {/* Celebration — done state */}
        {done && (
          <>
            <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6 text-center">
              <CircleCheckIcon className="mx-auto size-12 text-accent" />
              <p className="mt-3 text-lg font-bold">Trip recovered!</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {scenario.resolvedNote}
              </p>
            </div>

            {/* Digital Vouchers */}
            <div className="rounded-2xl border border-border bg-card p-4">
              <DigitalVouchers scenario={scenario} />
            </div>
          </>
        )}

        {/* Saga ledger — what we did */}
        {sim.steps.length > 0 && (
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="mb-3 text-xs font-semibold tracking-widest text-muted-foreground">
              {done ? "WHAT WE DID" : "IN PROGRESS"}
            </p>
            <ol className="flex flex-col gap-2">
              {sim.steps.map((s) => (
                <li
                  key={s.ref}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm",
                    s.state === "done" && "border-accent/30 bg-accent/5",
                    s.state === "failed" && "border-destructive bg-destructive/5",
                    s.state === "compensated" && "border-border opacity-60",
                  )}
                >
                  {s.state === "done" && (
                    <CheckIcon className="size-4 shrink-0 text-accent" />
                  )}
                  {s.state === "active" && (
                    <LoaderCircleIcon className="size-4 shrink-0 animate-spin text-primary" />
                  )}
                  {s.state === "failed" && (
                    <XIcon className="size-4 shrink-0 text-destructive" />
                  )}
                  {s.state === "compensated" && (
                    <CircleAlertIcon className="size-4 shrink-0 text-muted-foreground" />
                  )}
                  {s.state === "todo" && (
                    <span className="size-4 shrink-0 rounded-full border border-border" />
                  )}
                  <span className={cn(s.state === "compensated" && "line-through")}>
                    {s.label}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Failed state */}
        {failed && (
          <div className="flex flex-col gap-3">
            <Alert variant="destructive">
              <CircleAlertIcon className="size-4" />
              <AlertTitle className="text-sm font-bold">
                A step failed — we rolled everything back
              </AlertTitle>
              <AlertDescription className="text-xs">
                Nothing was half-booked. Your original bookings are still intact.
              </AlertDescription>
            </Alert>
            <Link href="/options" className="block">
              <div className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-border px-4 py-3 text-sm font-bold transition-all active:scale-[0.98]">
                Try another option
              </div>
            </Link>
          </div>
        )}

        {/* Event log — what happened behind the scenes */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold tracking-widest text-muted-foreground">
              WHAT HAPPENED BEHIND THE SCENES
            </p>
            <Badge variant={active ? "default" : "outline"}>
              {active ? "● LIVE" : "○ DONE"}
            </Badge>
          </div>
          <div
            ref={logRef}
            className="board-scroll flex h-40 flex-col gap-1.5 overflow-y-auto rounded-xl border border-border bg-black/30 p-3 font-mono text-[11px]"
          >
            {sim.log.map((l, i) => (
              <p key={i} className="leading-relaxed">
                <span className="tnum text-muted-foreground">[{l.t}]</span>{" "}
                <span
                  className={cn(
                    "font-bold",
                    l.src === "WORKFLOW" || l.src === "SAGA"
                      ? "text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {l.src}
                </span>{" "}
                <span
                  className={cn(
                    l.tone === "bad" && "text-destructive",
                    l.tone === "warn" && "text-primary",
                    l.tone === "ok" && "text-foreground",
                    l.tone === "info" && "text-muted-foreground",
                  )}
                >
                  {l.msg}
                </span>
              </p>
            ))}
          </div>
        </div>

        {/* Failure injection — for demo only */}
        <button
          onClick={() => sim.setFailArmed((v) => !v)}
          className={cn(
            "flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-all active:scale-[0.98]",
            sim.failArmed
              ? "border-destructive bg-destructive/5"
              : "border-border bg-card",
          )}
        >
          <FlaskConicalIcon
            className={cn(
              "size-5 shrink-0",
              sim.failArmed ? "text-destructive" : "text-muted-foreground",
            )}
          />
          <div className="min-w-0 flex-1">
            <p
              className={cn(
                "text-sm font-bold",
                sim.failArmed ? "text-destructive" : "text-foreground",
              )}
            >
              {sim.failArmed
                ? "Simulating a booking failure"
                : "Simulate a booking failure"}
            </p>
            <p className="text-[11px] text-muted-foreground">
              Watch how we automatically roll everything back
            </p>
          </div>
          <span
            className={cn(
              "size-10 shrink-0 rounded-full border-2 transition-colors",
              sim.failArmed
                ? "border-destructive bg-destructive"
                : "border-border",
            )}
          >
            {sim.failArmed && (
              <CheckIcon className="mx-auto mt-2 size-4 text-white" />
            )}
          </span>
        </button>

        {/* Reset */}
        <div
          onClick={sim.reset}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-border px-4 py-3 text-sm font-bold transition-all active:scale-[0.98]"
        >
          <RotateCcwIcon className="size-4" />
          Try another trip
        </div>
      </div>
    </AppShell>
  );
}
