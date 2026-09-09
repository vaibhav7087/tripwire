"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Scenario } from "@/lib/scenarios";

export function ScenarioTabs({
  scenarios,
  value,
  onChange,
}: {
  scenarios: Scenario[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[11px] tracking-[0.22em] text-muted-foreground">
        LIVE TRIPS UNDER WATCH — PICK ONE TO TEST
      </p>
      <Tabs value={value} onValueChange={onChange}>
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
          {scenarios.map((s) => (
            <TabsTrigger key={s.id} value={s.id} className="font-mono">
              {s.tab}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
