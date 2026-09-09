"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  RadarIcon,
  GitBranchIcon,
  ListChecksIcon,
  CheckCircleIcon,
} from "lucide-react";
import { cn } from "cn";
import type { Phase } from "@/components/use-simulation";

const TABS = [
  { href: "/", label: "Trips", icon: HomeIcon },
  { href: "/analyze", label: "Status", icon: RadarIcon },
  { href: "/cascade", label: "Impact", icon: GitBranchIcon },
  { href: "/options", label: "Fix it", icon: ListChecksIcon },
  { href: "/execute", label: "Done", icon: CheckCircleIcon },
] as const;

const PHASE_BADGES: Partial<Record<Phase, string>> = {
  detecting: "!",
  cascading: "!",
  ready: "3",
  executing: "…",
  done: "✓",
  failed: "!",
};

export function BottomNav({ phase, className }: { phase: Phase; className?: string }) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "sticky bottom-0 inset-x-0 z-40 border-t border-border/80 bg-card/95 backdrop-blur-md safe-area-pb",
        className,
      )}
    >
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-1.5">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          const badge =
            tab.href === "/options" && PHASE_BADGES[phase]
              ? PHASE_BADGES[phase]
              : null;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[10px] font-medium tracking-wide transition-all",
                active
                  ? "text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span className="relative">
                <tab.icon className={cn("size-4.5 transition-transform", active && "scale-110")} />
                {badge && (
                  <span className="absolute -top-1.5 -right-2.5 flex size-4 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground shadow-xs animate-pulse">
                    {badge}
                  </span>
                )}
              </span>
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
