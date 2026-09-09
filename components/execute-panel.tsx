"use client";

import {
  CheckIcon,
  CircleAlertIcon,
  CircleCheckIcon,
  LoaderCircleIcon,
  ScrollTextIcon,
  XIcon,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Progress } from "@/components/ui/progress";
import { cn } from "cn";
import type { ExecStep, Phase } from "@/components/use-simulation";

export function ExecutePanel({
  phase,
  steps,
  progress,
  resolvedNote,
  onBack,
}: {
  phase: Phase;
  steps: ExecStep[];
  progress: number;
  resolvedNote: string;
  onBack: () => void;
}) {
  const active = phase === "executing";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Execution · saga ledger</CardTitle>
        <CardDescription>
          {active
            ? `Running compensable workflow · ${progress}%`
            : phase === "done"
              ? "Saga closed · all steps confirmed"
              : phase === "failed"
                ? "Saga compensated · no partial bookings"
                : "Approved plans execute here"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {steps.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ScrollTextIcon />
              </EmptyMedia>
              <EmptyTitle>Ledger empty</EmptyTitle>
              <EmptyDescription>
                Approve an option to open the saga and watch each booking land.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <>
            <Progress value={progress} />
            <ol className="flex flex-col gap-2">
              {steps.map((s) => (
                <li
                  key={s.ref}
                  className={cn(
                    "flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm",
                    s.state === "failed" && "border-destructive",
                    s.state === "compensated" && "border-border opacity-70",
                  )}
                >
                  <span className="flex items-center gap-2">
                    {s.state === "done" && (
                      <CheckIcon data-icon="inline-start" className="text-accent" />
                    )}
                    {s.state === "active" && (
                      <LoaderCircleIcon data-icon="inline-start" className="animate-spin text-primary" />
                    )}
                    {s.state === "failed" && (
                      <XIcon data-icon="inline-start" className="text-destructive" />
                    )}
                    {s.state === "compensated" && (
                      <CircleAlertIcon data-icon="inline-start" className="text-muted-foreground" />
                    )}
                    {s.state === "todo" && (
                      <span className="size-4 shrink-0 rounded-full border border-border" />
                    )}
                    <span className={cn(s.state === "compensated" && "line-through")}>
                      {s.label}
                    </span>
                  </span>
                  <span className="tnum shrink-0 font-mono text-[11px] text-muted-foreground">
                    {s.ref}
                  </span>
                </li>
              ))}
            </ol>
          </>
        )}
        {phase === "done" && (
          <Alert>
            <CircleCheckIcon />
            <AlertTitle>Trip recovered</AlertTitle>
            <AlertDescription>{resolvedNote}</AlertDescription>
          </Alert>
        )}
        {phase === "failed" && (
          <div className="flex flex-col gap-2">
            <Alert variant="destructive">
              <CircleAlertIcon />
              <AlertTitle>Supplier rejected a step — compensated</AlertTitle>
              <AlertDescription>
                Holds released in reverse order. Nothing half-booked. Pick another option.
              </AlertDescription>
            </Alert>
            <Button variant="outline" onClick={onBack}>
              Back to options
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
