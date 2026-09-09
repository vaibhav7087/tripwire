"use client";

import {
  BedDoubleIcon,
  CarFrontIcon,
  PlaneIcon,
  PlaneTakeoffIcon,
  TicketIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Phase } from "@/components/use-simulation";
import type { CascadeLeg, LegKind, LegStatus } from "@/lib/scenarios";

const KIND_ICON: Record<LegKind, typeof PlaneIcon> = {
  flight: PlaneIcon,
  hotel: BedDoubleIcon,
  pickup: CarFrontIcon,
  activity: TicketIcon,
  return: PlaneTakeoffIcon,
};

function statusBadge(status: LegStatus, recovered: boolean) {
  if (recovered && (status === "atrisk" || status === "delayed" || status === "cancelled")) {
    return <Badge variant="success">REBOOKED</Badge>;
  }
  switch (status) {
    case "delayed":
    case "cancelled":
      return <Badge variant="destructive">{status.toUpperCase()}</Badge>;
    case "atrisk":
      return <Badge variant="default">AT RISK</Badge>;
    case "ontime":
      return <Badge variant="outline">ON TIME</Badge>;
    case "rebooked":
      return <Badge variant="success">REBOOKED</Badge>;
  }
}

export function CascadePanel({
  legs,
  phase,
}: {
  legs: CascadeLeg[];
  phase: Phase;
}) {
  const affected = legs.filter((l) => l.status !== "ontime").length;
  const recovered = phase === "done";
  const loading = phase === "cascading";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cascade impact</CardTitle>
        <CardDescription>GNN trip-graph assessment · attention-weighted</CardDescription>
        <CardAction>
          <Badge variant={affected > 0 ? "destructive" : "outline"}>
            {affected} LEGS AFFECTED
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        {phase === "idle" || phase === "detecting" ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <PlaneIcon />
              </EmptyMedia>
              <EmptyTitle>No disruption on the graph</EmptyTitle>
              <EmptyDescription>
                Run the simulation to watch delay prediction hit the trip dependency graph.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Table className="table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[31%]">LEG</TableHead>
                <TableHead className="w-[19%]">SCHEDULED</TableHead>
                <TableHead className="w-[14%]">STATUS</TableHead>
                <TableHead className="w-[36%]">IMPACT</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? legs.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell colSpan={4}>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                : legs.map((l) => {
                    const Icon = KIND_ICON[l.kind];
                    return (
                      <TableRow key={l.id}>
                        <TableCell>
                          <span className="flex items-center gap-2 font-medium">
                            <Icon className="size-4 shrink-0 text-muted-foreground" />
                            {l.leg}
                          </span>
                        </TableCell>
                        <TableCell className="tnum font-mono text-xs">{l.scheduled}</TableCell>
                        <TableCell>{statusBadge(l.status, recovered)}</TableCell>
                        <TableCell className="whitespace-normal text-muted-foreground">
                          {l.impact}
                        </TableCell>
                      </TableRow>
                    );
                  })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
