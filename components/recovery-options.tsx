"use client";

import { CheckIcon, ListChecksIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { cn } from "cn";
import type { Phase } from "@/components/use-simulation";
import type { RecoveryOption } from "@/lib/scenarios";

export function RecoveryOptions({
  options,
  selectedId,
  onSelect,
  phase,
  onApprove,
}: {
  options: RecoveryOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  phase: Phase;
  onApprove: () => void;
}) {
  const selectable = phase === "ready" || phase === "failed" || phase === "done";
  const selected = options.find((o) => o.id === selectedId) ?? options[0];

  if (phase === "idle" || phase === "detecting" || phase === "cascading") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recovery options</CardTitle>
          <CardDescription>Explainable plans with policy citations</CardDescription>
        </CardHeader>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ListChecksIcon />
              </EmptyMedia>
              <EmptyTitle>Awaiting impact assessment</EmptyTitle>
              <EmptyDescription>
                Gemini drafts ranked options once the cascade settles.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-sm font-bold tracking-[0.18em]">RECOVERY OPTIONS</h2>
        <p className="font-mono text-[11px] text-muted-foreground">
          {options.length} POLICY-CHECKED PLANS
        </p>
      </div>
      {options.map((o) => {
        const active = o.id === selectedId;
        return (
          <Card
            key={o.id}
            onClick={() => selectable && onSelect(o.id)}
            className={cn(
              "cursor-pointer transition-colors",
              active && "border-primary",
              !selectable && "pointer-events-none",
            )}
          >
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full border",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-transparent",
                  )}
                >
                  <CheckIcon data-icon="inline-start" />
                </span>
                <CardTitle>{o.title}</CardTitle>
                <Badge variant="secondary">{o.tag}</Badge>
              </div>
              <CardDescription className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs">
                <span className="tnum">{o.costNote}</span>
                <span className="tnum">{o.timeSaved}</span>
                <span className="tnum">confidence {o.confidence}%</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <ul className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                {o.reasoning.map((r, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-primary">▸</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
              <Accordion type="single" collapsible>
                <AccordionItem value="policy">
                  <AccordionTrigger className="text-xs tracking-[0.14em]">
                    POLICY BASIS · {o.policySource.toUpperCase()}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {o.policyCite}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="plan">
                  <AccordionTrigger className="text-xs tracking-[0.14em]">
                    EXECUTION PLAN · {o.plan.length} STEPS
                  </AccordionTrigger>
                  <AccordionContent>
                    <ol className="flex flex-col gap-1.5">
                      {o.plan.map((p, i) => (
                        <li key={p.ref} className="flex items-baseline justify-between gap-2 text-sm">
                          <span className="text-muted-foreground">
                            {i + 1}. {p.label}
                          </span>
                          <span className="tnum shrink-0 font-mono text-[11px] text-muted-foreground">
                            {p.ref}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        );
      })}
      {selectable && phase !== "done" && (
        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg" className="w-full">
              <CheckIcon data-icon="inline-start" />
              Approve “{selected.title}” — 1 tap
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Approve this recovery?</DialogTitle>
                  <DialogDescription>
                    One tap executes {selected.plan.length} bookings with saga rollback on
                    any failure. {selected.costNote} · {selected.timeSaved}.
                  </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Not now</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button onClick={onApprove}>
                  <CheckIcon data-icon="inline-start" />
                  Confirm & execute
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
