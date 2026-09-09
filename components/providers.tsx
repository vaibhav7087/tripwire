"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { SimulationProvider } from "@/components/simulation-context";
import { ViewModeProvider } from "@/components/view-mode-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" enableSystem={false}>
      <TooltipProvider>
        <SimulationProvider>
          <ViewModeProvider>
            {children}
            <Toaster position="top-right" richColors closeButton />
          </ViewModeProvider>
        </SimulationProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
