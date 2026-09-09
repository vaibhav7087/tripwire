"use client";

import * as React from "react";
import { useSimulation, type Simulation } from "@/components/use-simulation";
import { SCENARIOS } from "@/lib/scenarios";

const SimulationContext = React.createContext<Simulation | null>(null);
const ScenarioContext = React.createContext<{
  scenarioId: string;
  setScenarioId: (id: string) => void;
  scenario: (typeof SCENARIOS)[number];
} | null>(null);

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const [scenarioId, setScenarioId] = React.useState(SCENARIOS[0].id);
  const scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0];
  const sim = useSimulation(scenario);

  return (
    <ScenarioContext.Provider value={{ scenarioId, setScenarioId, scenario }}>
      <SimulationContext.Provider value={sim}>{children}</SimulationContext.Provider>
    </ScenarioContext.Provider>
  );
}

export function useSim() {
  const ctx = React.useContext(SimulationContext);
  if (!ctx) throw new Error("useSim must be used within SimulationProvider");
  return ctx;
}

export function useScenario() {
  const ctx = React.useContext(ScenarioContext);
  if (!ctx) throw new Error("useScenario must be used within SimulationProvider");
  return ctx;
}
