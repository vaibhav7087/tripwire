"use client";

import * as React from "react";
import { PlayIcon, RadarIcon, RotateCcwIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Phase } from "@/components/use-simulation";

function useClock(): string {
  const [now, setNow] = React.useState("--:--:--");
  React.useEffect(() => {
    const tick = () =>
      setNow(
        new Date().toLocaleTimeString("en-GB", {
          timeZone: "Asia/Kolkata",
          hour12: false,
        }),
      );
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

export function StatusBar({
  phase,
  onRun,
  onReset,
}: {
  phase: Phase;
  onRun: () => void;
  onReset: () => void;
}) {
  const clock = useClock();
  const running = phase === "detecting" || phase === "cascading" || phase === "executing";

  return (
    <header className="flex flex-col gap-3 border-b border-border pb-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <RadarIcon data-icon="inline-start" />
        </span>
        <div>
          <p className="text-lg leading-none font-bold tracking-[0.18em]">
            TRIPWIRE
          </p>
          <p className="mt-1 text-[11px] tracking-[0.22em] text-muted-foreground">
            TRAVEL DISRUPTION RECOVERY ENGINE
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="success">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent-foreground opacity-60" />
            <span className="relative inline-flex size-1.5 rounded-full bg-accent-foreground" />
          </span>
          ALL SYSTEMS NOMINAL
        </Badge>
        <span className="tnum font-mono text-sm text-muted-foreground">
          {clock} IST
        </span>
        <Separator orientation="vertical" className="h-5" />
        <Button size="sm" onClick={onRun} disabled={running}>
          <PlayIcon data-icon="inline-start" />
          Run simulation
        </Button>
        <Button size="sm" variant="outline" onClick={onReset}>
          <RotateCcwIcon data-icon="inline-start" />
          Reset
        </Button>
      </div>
    </header>
  );
}
