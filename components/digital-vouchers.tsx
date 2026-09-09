"use client";

import {
  PlaneIcon,
  BedDoubleIcon,
  CarFrontIcon,
  QrCodeIcon,
  DownloadIcon,
  Share2Icon,
  CheckCircle2Icon,
  PrinterIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { Scenario } from "@/lib/scenarios";
import { cn } from "cn";

interface DigitalVouchersProps {
  scenario: Scenario;
  className?: string;
}

export function DigitalVouchers({ scenario, className }: DigitalVouchersProps) {
  const handleDownload = () => {
    toast.success("Consolidated Emergency Itinerary generated", {
      description: "PDF ready with revised boarding cards and waiver certificates.",
    });
  };

  const handleShare = () => {
    toast.info("Itinerary shared", {
      description: `SMS & WhatsApp alert sent to ${scenario.pax}.`,
    });
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <CheckCircle2Icon className="size-4 text-accent" />
            <h3 className="font-heading text-sm font-bold tracking-tight text-foreground">
              ISSUED DIGITAL RESOLUTION VOUCHERS
            </h3>
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Confirmed supplier updates dispatched directly to your mobile wallet
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all"
          >
            <Share2Icon className="size-3" />
            <span>Share</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-xs hover:opacity-90 transition-all"
          >
            <DownloadIcon className="size-3" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Grid of Digital Vouchers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Voucher 1: Flight Boarding Pass / Rebook */}
        <div className="relative overflow-hidden rounded-2xl border border-accent/40 bg-gradient-to-b from-card to-accent/5 p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-bold text-foreground">
                <PlaneIcon className="size-3.5 text-accent" />
                {scenario.airline}
              </span>
              <Badge variant="outline" className="border-accent/40 text-accent font-mono text-[9px]">
                CONFIRMED
              </Badge>
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <div>
                <p className="font-mono text-2xl font-bold">{scenario.route.split("→")[0]?.trim()}</p>
                <p className="font-mono text-[10px] text-muted-foreground">{scenario.schedDep}</p>
              </div>
              <span className="text-muted-foreground text-xs font-mono">✈ ➔</span>
              <div className="text-right">
                <p className="font-mono text-2xl font-bold">{scenario.route.split("→")[1]?.trim()}</p>
                <p className="font-mono text-[10px] text-muted-foreground">Adjusted Arrival</p>
              </div>
            </div>

            <div className="mt-3 border-t border-dashed border-border/80 pt-2.5 text-[11px] text-muted-foreground space-y-1">
              <p className="flex justify-between">
                <span>Passenger:</span>
                <span className="font-bold text-foreground">{scenario.pax}</span>
              </p>
              <p className="flex justify-between">
                <span>Flight PNR:</span>
                <span className="font-mono text-foreground">TW-{scenario.flightNo.replace("-", "")}-OK</span>
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
            <span className="font-mono text-[9px] text-muted-foreground">DIGITAL WALLET SYNCED</span>
            <QrCodeIcon className="size-6 text-foreground/80" />
          </div>
        </div>

        {/* Voucher 2: Hotel Late-Arrival Waiver */}
        <div className="relative overflow-hidden rounded-2xl border border-accent/40 bg-gradient-to-b from-card to-accent/5 p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-bold text-foreground">
                <BedDoubleIcon className="size-3.5 text-accent" />
                Accommodation Waiver
              </span>
              <Badge variant="outline" className="border-accent/40 text-accent font-mono text-[9px]">
                FEE WAIVED
              </Badge>
            </div>

            <div className="mt-3">
              <p className="font-bold text-sm text-foreground">The Lalit New Delhi</p>
              <p className="text-xs text-muted-foreground">Late Check-in Window Extended</p>
            </div>

            <div className="mt-3 border-t border-dashed border-border/80 pt-2.5 text-[11px] text-muted-foreground space-y-1">
              <p className="flex justify-between">
                <span>Room Hold:</span>
                <span className="font-bold text-accent">Guaranteed to 02:00 AM</span>
              </p>
              <p className="flex justify-between">
                <span>No-Show Fee:</span>
                <span className="font-mono text-foreground line-through">₹4,500</span>
                <span className="font-bold text-accent">₹0 (Waived)</span>
              </p>
              <p className="flex justify-between">
                <span>Waiver Code:</span>
                <span className="font-mono text-foreground">HTL-8841-SHIFT</span>
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
            <span className="font-mono text-[9px] text-accent font-semibold">24H DESK NOTIFIED</span>
            <PrinterIcon className="size-4 text-muted-foreground" />
          </div>
        </div>

        {/* Voucher 3: Driver Dispatch Rescheduled */}
        <div className="relative overflow-hidden rounded-2xl border border-accent/40 bg-gradient-to-b from-card to-accent/5 p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-bold text-foreground">
                <CarFrontIcon className="size-3.5 text-accent" />
                Airport Transfer
              </span>
              <Badge variant="outline" className="border-accent/40 text-accent font-mono text-[9px]">
                DISPATCHED
              </Badge>
            </div>

            <div className="mt-3">
              <p className="font-bold text-sm text-foreground">Swift Dzire · Sedan</p>
              <p className="text-xs text-muted-foreground">Slotted for Terminal Arrival</p>
            </div>

            <div className="mt-3 border-t border-dashed border-border/80 pt-2.5 text-[11px] text-muted-foreground space-y-1">
              <p className="flex justify-between">
                <span>Assigned Driver:</span>
                <span className="font-bold text-foreground">Ramesh Kumar</span>
              </p>
              <p className="flex justify-between">
                <span>Vehicle Plate:</span>
                <span className="font-mono text-foreground">DL-1ZA-4402</span>
              </p>
              <p className="flex justify-between">
                <span>Pickup Window:</span>
                <span className="font-bold text-accent">00:15 IST (No Surge)</span>
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
            <span className="font-mono text-[9px] text-muted-foreground">LIVE GPS TRACKING ACTIVE</span>
            <span className="size-2 rounded-full bg-accent animate-ping" />
          </div>
        </div>
      </div>
    </div>
  );
}
