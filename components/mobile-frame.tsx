"use client";

import * as React from "react";
import { WifiIcon, BatteryMediumIcon, SignalIcon } from "lucide-react";
import { cn } from "cn";

export function MobileFrame({ children }: { children: React.ReactNode }) {
  const [time, setTime] = React.useState("15:32");

  React.useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const h = String(d.getHours()).padStart(2, "0");
      const m = String(d.getMinutes()).padStart(2, "0");
      setTime(`${h}:${m}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex w-full flex-col items-center justify-center py-4 md:py-8">
      {/* Device wrapper for tablet/desktop */}
      <div className="relative w-full max-w-[430px] rounded-none sm:rounded-[48px] sm:border-[8px] sm:border-neutral-800 sm:bg-neutral-950 sm:p-2 sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.1)]">
        {/* Dynamic Island & Speaker (desktop/tablet only) */}
        <div className="relative mx-auto hidden h-6 w-full max-w-[400px] items-center justify-between px-6 pt-2 text-[11px] font-semibold text-foreground/80 sm:flex">
          <span className="font-mono tracking-tight">{time}</span>
          {/* Dynamic Island pill */}
          <div className="absolute left-1/2 top-2 flex h-5 w-24 -translate-x-1/2 items-center justify-between rounded-full bg-black px-2.5 shadow-inner">
            <span className="size-2 rounded-full bg-neutral-900 border border-neutral-800" />
            <span className="size-1.5 rounded-full bg-amber-500/80 animate-pulse" />
          </div>
          <div className="flex items-center gap-1.5 text-foreground/70">
            <SignalIcon className="size-3" />
            <WifiIcon className="size-3" />
            <BatteryMediumIcon className="size-3.5" />
          </div>
        </div>

        {/* Screen container */}
        <div className="relative flex min-h-[780px] sm:max-h-[860px] sm:min-h-[820px] w-full flex-col overflow-hidden sm:overflow-y-auto sm:rounded-[36px] bg-background board-scroll">
          {children}

          {/* Bottom Home Indicator on desktop frame */}
          <div className="pointer-events-none sticky bottom-1 left-0 right-0 z-50 hidden justify-center py-1 sm:flex">
            <div className="h-1 w-32 rounded-full bg-foreground/20 backdrop-blur-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
