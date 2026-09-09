"use client";

import { CheckIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "cn";
import type { Phase } from "@/components/use-simulation";

const STAGES = [
  { key: "detect", name: "DETECT", meta: "LightGBM · 94.2%" },
  { key: "cascade", name: "CASCADE", meta: "GNN trip-graph" },
  { key: "generate", name: "GENERATE", meta: "Gemini · 3 options" },
  { key: "validate", name: "VALIDATE", meta: "Policy engine" },
  { key: "approve", name: "APPROVE", meta: "1 tap" },
  { key: "execute", name: "EXECUTE", meta: "Saga · <200 ms plan" },
] as const;

function stageState(
  key: (typeof STAGES)[number]["key"],
  phase: Phase,
): "done" | "active" | "todo" {
  const order = ["detect", "cascade", "generate", "validate", "approve", "execute"];
  const reached: Record<Phase, number> = {
    idle: -1,
    detecting: 0,
    cascading: 1,
    ready: 4,
    executing: 5,
    done: 6,
    failed: 5,
  };
  const idx = order.indexOf(key);
  const r = reached[phase];
  if (idx < r || phase === "done") return "done";
  if (idx === r) return "active";
  return "todo";
}

export function PipelineStepper({ phase }: { phase: Phase }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recovery pipeline</CardTitle>
        <CardDescription>Detect → cascade → generate → validate → approve → execute</CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="flex flex-col gap-1">
          {STAGES.map((s, i) => {
            const st = stageState(s.key, phase);
            return (
              <li key={s.key} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-bold",
                      st === "done" &&
                        "border-accent bg-accent text-accent-foreground",
                      st === "active" &&
                        "animate-pulse border-primary bg-primary text-primary-foreground",
                      st === "todo" && "border-border text-muted-foreground",
                    )}
                  >
                    {st === "done" ? <CheckIcon data-icon="inline-start" /> : <span>{i + 1}</span>}
                  </span>
                  {i < STAGES.length - 1 && (
                    <span
                      className={cn(
                        "w-px flex-1",
                        st === "done" ? "bg-accent" : "bg-border",
                      )}
                    />
                  )}
                </div>
                <div className="flex flex-1 items-baseline justify-between gap-2 pb-4">
                  <p
                    className={cn(
                      "text-sm font-bold tracking-[0.14em]",
                      st === "todo" && "text-muted-foreground",
                    )}
                  >
                    {s.name}
                  </p>
                  <p className="font-mono text-[11px] text-muted-foreground">{s.meta}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}
