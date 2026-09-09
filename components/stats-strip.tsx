import { Card, CardContent } from "@/components/ui/card";

const STATS = [
  { num: "94.2%", label: "delay-prediction accuracy · 2.4M records" },
  { num: "<200 ms", label: "recovery-plan generation" },
  { num: "6 → 1", label: "manual steps down to one tap" },
  { num: "$0/mo", label: "infra · every layer free tier" },
];

export function StatsStrip() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {STATS.map((s) => (
        <Card key={s.num} size="sm">
          <CardContent className="flex items-baseline gap-3">
            <p className="tnum font-mono text-2xl font-bold text-primary md:text-3xl">
              {s.num}
            </p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
