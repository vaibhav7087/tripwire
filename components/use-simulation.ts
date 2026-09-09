"use client";

import * as React from "react";
import { toast } from "sonner";
import type { RecoveryOption, Scenario } from "@/lib/scenarios";

export type Phase =
  | "idle"
  | "detecting"
  | "cascading"
  | "ready"
  | "executing"
  | "done"
  | "failed";

export interface LogLine {
  t: string;
  src: string;
  msg: string;
  tone: "info" | "ok" | "warn" | "bad";
}

export interface ExecStep {
  label: string;
  ref: string;
  state: "todo" | "active" | "done" | "failed" | "compensated";
}

function stamp(base: number, plusSec: number): string {
  const d = new Date(base + plusSec * 1000);
  return d.toLocaleTimeString("en-GB", { hour12: false });
}

export function useSimulation(scenario: Scenario) {
  const [phase, setPhase] = React.useState<Phase>("ready");
  const [selectedId, setSelectedId] = React.useState<string>(
    scenario.options[0].id,
  );
  const [log, setLog] = React.useState<LogLine[]>([]);
  const [steps, setSteps] = React.useState<ExecStep[]>([]);
  const [failArmed, setFailArmed] = React.useState(false);
  const timers = React.useRef<number[]>([]);
  const clock = React.useRef<number>(Date.now());

  const clearTimers = React.useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);

  const push = React.useCallback((src: string, msg: string, tone: LogLine["tone"] = "info") => {
    const elapsed = Math.floor((Date.now() - clock.current) / 1000);
    setLog((prev) => [...prev, { t: stamp(clock.current, elapsed), src, msg, tone }]);
  }, []);

  const later = React.useCallback((ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  const reset = React.useCallback(() => {
    clearTimers();
    clock.current = Date.now();
    setPhase("ready");
    setSelectedId(scenario.options[0].id);
    setSteps([]);
    setFailArmed(false);
    setLog([]);
  }, [clearTimers, scenario]);

  React.useEffect(() => {
    reset();
    return clearTimers;
  }, [reset, clearTimers]);

  const selected: RecoveryOption =
    scenario.options.find((o) => o.id === selectedId) ?? scenario.options[0];

  const run = React.useCallback(() => {
    clearTimers();
    clock.current = Date.now();
    setSteps([]);
    setPhase("detecting");
    setLog([]);
    push("LIGHTGBM", "Scoring delay features: rotation, weather, congestion…");
    later(800, () => {
      push("LIGHTGBM", `P(delay) crossed threshold — ${scenario.triggerTitle}`, "warn");
      push("QUEUE", "Disruption event published · retained 24h", "info");
      setPhase("cascading");
      push("GNN", "Loading trip dependency graph: 5 nodes, 8 edges…");
    });
    later(1600, () => {
      push("GNN", "Attention weights settled: hotel 0.91 · pickup 0.87 · tour 0.76", "ok");
      push("GEMINI", "Drafting 3 recovery options with reasoning…");
    });
    later(2400, () => {
      push("POLICY", "3/3 options validated against fare + cancellation rules", "ok");
      push("QUEUE", "Options pushed to console · awaiting 1-tap approval", "info");
      setPhase("ready");
      toast.success("3 recovery options ready", {
        description: "Policy-checked · pick one tap to execute",
      });
    });
  }, [clearTimers, later, push, scenario]);

  const execute = React.useCallback(() => {
    const plan = selected.plan.map((p) => ({ ...p, state: "todo" as const }));
    setSteps(plan);
    setPhase("executing");
    push("WORKFLOW", `Saga opened for “${selected.title}” · ${plan.length} steps`, "info");
    plan.forEach((step, i) => {
      later(650 * (i + 1), () => {
        if (failArmed && i === 1) {
          setSteps((prev) =>
            prev.map((s, j) => ({ ...s, state: j < i ? s.state : j === i ? "failed" : s.state })),
          );
          push("WORKFLOW", `${step.ref} rejected by supplier — starting compensation`, "bad");
          const done = plan.slice(0, i).reverse();
          done.forEach((d, k) => {
            later(700 * (k + 1), () => {
              setSteps((prev) =>
                prev.map((s) => (s.ref === d.ref ? { ...s, state: "compensated" } : s)),
              );
              push("SAGA", `Compensated ${d.ref}: hold released, no partial booking`, "warn");
              if (k === done.length - 1) {
                setPhase("failed");
                setFailArmed(false);
                toast.error("Booking step failed — rolled back", {
                  description: "No partial bookings · pick another option",
                });
              }
            });
          });
          if (done.length === 0) {
            setPhase("failed");
            setFailArmed(false);
          }
          return;
        }
        setSteps((prev) => prev.map((s, j) => ({ ...s, state: j < i ? s.state : j === i ? "done" : s.state })));
        push("WORKFLOW", `✓ ${step.label} [${step.ref}]`, "ok");
        if (i === plan.length - 1) {
          later(400, () => {
            push("WORKFLOW", "Saga closed · all steps confirmed", "ok");
            setPhase("done");
            toast.success("Trip recovered", { description: scenario.resolvedNote });
          });
        }
      });
      later(650 * i + 80, () => {
        setSteps((prev) => {
          if (phase === "failed") return prev;
          return prev.map((s, j) => (j === i && s.state === "todo" ? { ...s, state: "active" } : s));
        });
      });
    });
  }, [failArmed, later, push, selected, scenario, phase]);

  const progress =
    steps.length === 0
      ? 0
      : Math.round(
          (steps.filter((s) => s.state === "done").length / steps.length) * 100,
        );

  return {
    phase,
    selected,
    selectedId,
    setSelectedId,
    log,
    steps,
    progress,
    failArmed,
    setFailArmed,
    run,
    reset,
    execute,
    backToOptions: () => setPhase("ready"),
  };
}

export type Simulation = ReturnType<typeof useSimulation>;
