import { Separator } from "@/components/ui/separator";

const VENDORS = [
  { src: "/vendors/cloudflare.svg", name: "Cloudflare", note: "Workers · 100K/d" },
  { src: "/vendors/supabase.svg", name: "Supabase", note: "Postgres · 500MB" },
  { src: "/vendors/redis.svg", name: "Upstash", note: "Redis · 500K/mo" },
  { src: "/vendors/googlegemini.svg", name: "Gemini Flash", note: "Plans · 1.5K/d" },
];

export function TechStrip() {
  return (
    <div className="flex flex-col gap-3 border-t border-border pt-4">
      <p className="text-[11px] tracking-[0.22em] text-muted-foreground">
        RUNNING ON · EVERY LAYER A FREE TIER
      </p>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {VENDORS.map((v) => (
          <div
            key={v.name}
            className="flex items-center gap-3 rounded-md border border-border bg-card px-3 py-2.5"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={v.src} alt={v.name} className="size-7 shrink-0" />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{v.name}</p>
              <p className="tnum truncate font-mono text-[11px] text-muted-foreground">
                {v.note}
              </p>
            </div>
          </div>
        ))}
      </div>
      <Separator />
      <div className="flex flex-col gap-1 pb-2 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>
          <span className="font-bold text-foreground">TRIPWIRE</span> by{" "}
          <span className="font-bold text-foreground">nan chalants</span> · HackCelestial
          3.0 · PS-2 Travel Disruption Recovery Engine
        </p>
        <p className="tnum font-mono">
          T0 demo $0 · T1 pilot ~$50/mo · T2 ~$200/mo @ 1K+ trips/day
        </p>
      </div>
    </div>
  );
}
