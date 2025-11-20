import { create } from "zustand";

type DataTableMetricsState = {
  counts: Record<string, number>;
  setCount: (key: string, count: number) => void;
  clear: (key?: string) => void;
};

export const useDataTableMetricsStore = create<DataTableMetricsState>((set) => ({
  counts: {},
  setCount: (key, count) =>
    set((s) => ({ counts: { ...s.counts, [key]: count } })),
  clear: (key) =>
    set((s) =>
      key
        ? { counts: Object.fromEntries(Object.entries(s.counts).filter(([k]) => k !== key)) }
        : { counts: {} }
    ),
}));

