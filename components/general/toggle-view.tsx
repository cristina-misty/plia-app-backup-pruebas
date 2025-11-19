"use client";

import * as React from "react";
import { Button } from "../ui/button";
import { IconCards, IconTable } from "@tabler/icons-react";

export function useToggleView(initial = false) {
  const [viewToggle, setViewToggle] = React.useState<boolean>(initial);
  const toggle = React.useCallback(() => setViewToggle((v) => !v), []);

  const viewTable = viewToggle ? "block" : "hidden";
  const viewCards = viewToggle ? "hidden" : "block";

  return {
    viewToggle,
    setViewToggle,
    toggle,
    viewTable,
    viewCards,
    isTableVisible: viewToggle,
    isCardsVisible: !viewToggle,
  };
}

export type ViewMode = "table" | "cards" | "charts";

export function useToggleView3(initial: ViewMode = "table") {
  const [mode, setMode] = React.useState<ViewMode>(initial);
  const cycle = React.useCallback(() => {
    setMode((m) =>
      m === "table" ? "cards" : m === "cards" ? "charts" : "table"
    );
  }, []);

  const viewTable = mode === "table" ? "block" : "hidden";
  const viewCards = mode === "cards" ? "block" : "hidden";
  const viewCharts = mode === "charts" ? "block" : "hidden";

  return { mode, setMode, cycle, viewTable, viewCards, viewCharts };
}

export function ToggleViewButton({
  value,
  onChange,
  className,
  labelTable = "Mostrar tabla",
  labelCards = "Mostrar tarjetas",
}: {
  value?: boolean;
  onChange?: (next: boolean) => void;
  className?: string;
  labelTable?: string;
  labelCards?: string;
}) {
  const [internal, setInternal] = React.useState<boolean>(false);
  const isControlled =
    typeof value === "boolean" && typeof onChange === "function";
  const state = isControlled ? value : internal;
  const setState = isControlled
    ? onChange!
    : (next: boolean) => setInternal(next);

  return (
    <Button className={className} onClick={() => setState(!state)}>
      {state ? (
        <span className="flex items-center gap-2">
          <IconCards />
          {/* <span>{labelCards}</span> */}
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <IconTable />
          {/* <span>{labelTable}</span> */}
        </span>
      )}
    </Button>
  );
}

export function ToggleViewGroup({
  value,
  onChange,
  className,
  chartsEnabled = true,
}: {
  value?: ViewMode;
  onChange?: (next: ViewMode) => void;
  className?: string;
  chartsEnabled?: boolean;
}) {
  const [internal, setInternal] = React.useState<ViewMode>("table");
  const isControlled =
    typeof value === "string" && typeof onChange === "function";
  const state = isControlled ? (value as ViewMode) : internal;
  const setState = isControlled
    ? onChange!
    : (next: ViewMode) => setInternal(next);

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <Button
          variant={state === "cards" ? "default" : "outline"}
          size="icon"
          aria-label="Show cards"
          onClick={() => setState("cards")}
        >
          <IconCards />
        </Button>
        <Button
          variant={state === "table" ? "default" : "outline"}
          size="icon"
          aria-label="Show table"
          onClick={() => setState("table")}
        >
          <IconTable />
        </Button>
        <Button
          variant={state === "charts" ? "default" : "outline"}
          size="icon"
          aria-label="Show charts"
          onClick={() => (chartsEnabled ? setState("charts") : undefined)}
          disabled={!chartsEnabled}
        >
          {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
          <IconChartDonut />
        </Button>
      </div>
    </div>
  );
}

import { IconChartDonut } from "@tabler/icons-react";

export default ToggleViewButton;
