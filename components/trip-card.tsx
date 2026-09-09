"use client";

import { PlaneTakeoffIcon, TriangleAlertIcon, UsersIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Phase } from "@/components/use-simulation";
import type { Scenario } from "@/lib/scenarios";

export function TripCard({
  scenario,
  phase,
}: {
  scenario: Scenario;
  phase: Phase;
}) {
  const live = phase !== "idle";
  const recovered = phase === "done";

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <PlaneTakeoffIcon className="size-4 text-muted-foreground" />
            <CardTitle className="font-mono">
              {scenario.flightNo} · {scenario.airline}
            </CardTitle>
          </div>
          {recovered ? (
            <Badge variant="success">RECOVERED</Badge>
          ) : live ? (
            <Badge variant="destructive">DISRUPTION PREDICTED</Badge>
          ) : (
            <Badge variant="outline">SCHEDULED · MONITORED</Badge>
          )}
        </div>
        <CardDescription>
          {scenario.routeDetail} · {scenario.date}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="tnum font-mono text-4xl font-bold">{scenario.schedDep}</p>
            <p className="mt-1 text-xs tracking-[0.18em] text-muted-foreground">
              {scenario.route.split("→")[0]?.trim()} DEP
            </p>
          </div>
          <div className="flex flex-1 items-center gap-2 px-2 pb-3">
            <Separator className="flex-1" />
            <span className="font-mono text-xs text-muted-foreground">
              {scenario.route}
            </span>
            <Separator className="flex-1" />
          </div>
          <div className="text-right">
            <p className="tnum font-mono text-4xl font-bold">{scenario.schedArr}</p>
            <p className="mt-1 text-xs tracking-[0.18em] text-muted-foreground">
              ARR
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <UsersIcon className="size-3.5" />
          {scenario.pax}
        </div>
        {live && (
          <Alert variant="destructive">
            <TriangleAlertIcon />
            <AlertTitle className="font-mono">
              {scenario.triggerTitle} · <span className="tnum">{scenario.detectedAt}</span>
            </AlertTitle>
            <AlertDescription>
              {scenario.triggerDetail}
              <span className="mt-1 block font-mono text-xs opacity-80">
                {scenario.predictNote}
              </span>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
