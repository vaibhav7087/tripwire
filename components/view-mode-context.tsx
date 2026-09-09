"use client";

import * as React from "react";

export type ViewMode = "desktop" | "mobile";

interface ViewModeContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;
}

const ViewModeContext = React.createContext<ViewModeContextType | null>(null);

const STORAGE_KEY = "tripwire_view_mode";

export function ViewModeProvider({ children }: { children: React.ReactNode }) {
  const [viewMode, setViewModeState] = React.useState<ViewMode>("desktop");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(STORAGE_KEY) as ViewMode | null;
    if (saved === "desktop" || saved === "mobile") {
      setViewModeState(saved);
    } else if (window.innerWidth < 1024) {
      setViewModeState("mobile");
    }
  }, []);

  const setViewMode = React.useCallback((mode: ViewMode) => {
    setViewModeState(mode);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // ignore
    }
  }, []);

  const toggleViewMode = React.useCallback(() => {
    setViewMode(viewMode === "desktop" ? "mobile" : "desktop");
  }, [viewMode, setViewMode]);

  // Prevent flash before hydration mount
  return (
    <ViewModeContext.Provider value={{ viewMode, setViewMode, toggleViewMode }}>
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode() {
  const ctx = React.useContext(ViewModeContext);
  if (!ctx) {
    throw new Error("useViewMode must be used within ViewModeProvider");
  }
  return ctx;
}
