"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "cn";
import type { LogLine } from "@/components/use-simulation";

const SRC_TONE: Record<string, string> = {
  LIGHTGBM: "text-primary",
  GNN: "text-primary",
  GEMINI: "text-accent",
  POLICY: "text-accent",
  QUEUE: "text-muted-foreground",
  WORKFLOW: "text-foreground",
  SAGA: "text-destructive",
  MONITOR: "text-muted-foreground",
};

export function EventLog({ log, live }: { log: LogLine[]; live: boolean }) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [log.length]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event stream</CardTitle>
        <CardAction>
          <Badge variant={live ? "default" : "outline"}>
            {live ? "● LIVE" : "○ IDLE"}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div
          ref={ref}
          className="board-scroll flex h-56 flex-col gap-1.5 overflow-y-auto rounded-md border border-border bg-black/30 p-3 font-mono text-xs"
        >
          {log.map((l, i) => (
            <p key={i} className="leading-relaxed">
              <span className="tnum text-muted-foreground">[{l.t}]</span>{" "}
              <span className={cn("font-bold", SRC_TONE[l.src] ?? "text-foreground")}>
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
      </CardContent>
    </Card>
  );
}
