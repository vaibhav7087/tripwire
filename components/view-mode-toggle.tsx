"use client";

import { MonitorIcon, SmartphoneIcon } from "lucide-react";
import { useViewMode } from "@/components/view-mode-context";
import { cn } from "cn";

export function ViewModeToggle({ className }: { className?: string }) {
  const { viewMode, setViewMode } = useViewMode();

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-xl border border-border/80 bg-background/90 p-1 shadow-sm backdrop-blur-md",
        className,
      )}
      role="group"
      aria-label="Display View Mode"
    >
      <button
        type="button"
        onClick={() => setViewMode("desktop")}
        className={cn(
          "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all",
          viewMode === "desktop"
            ? "bg-primary text-primary-foreground shadow-xs"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <MonitorIcon className="size-3.5" />
        <span className="hidden sm:inline">Command Center</span>
        <span className="sm:hidden">Ops</span>
      </button>
      <button
        type="button"
        onClick={() => setViewMode("mobile")}
        className={cn(
          "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all",
          viewMode === "mobile"
            ? "bg-primary text-primary-foreground shadow-xs"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <SmartphoneIcon className="size-3.5" />
        <span className="hidden sm:inline">Passenger Mobile</span>
        <span className="sm:hidden">Mobile</span>
      </button>
    </div>
  );
}
