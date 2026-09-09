"use client";

import * as React from "react";
import { BottomNav } from "@/components/bottom-nav";
import { GlobalHeader } from "@/components/global-header";
import { MobileFrame } from "@/components/mobile-frame";
import { DesktopCommandCenter } from "@/components/desktop-command-center";
import { useSim } from "@/components/simulation-context";
import { useViewMode } from "@/components/view-mode-context";

export function AppShell({ children }: { children: React.ReactNode }) {
  const sim = useSim();
  const { viewMode } = useViewMode();

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground selection:bg-primary/30">
      <GlobalHeader />

      {viewMode === "desktop" ? (
        <main className="flex-1 pb-12">
          <DesktopCommandCenter />
        </main>
      ) : (
        <main className="flex-1 flex flex-col justify-start">
          <MobileFrame>
            <div className="flex min-h-[760px] flex-col justify-between">
              <div className="flex-1 px-4 pb-6 pt-4">{children}</div>
              <BottomNav phase={sim.phase} />
            </div>
          </MobileFrame>
        </main>
      )}
    </div>
  );
}
