import { create } from "zustand";

type NamespacedMetrics = Record<string, Record<string, number>>;

type DataTableMetricsState = {
  metrics: NamespacedMetrics;
  setMetric: (namespace: string, key: string, value: number) => void;
  setMetrics: (namespace: string, values: Record<string, number>) => void;
  clear: (namespace?: string) => void;
};

export const useDataTableMetricsStore = create<DataTableMetricsState>(
  (set) => ({
    metrics: {},
    setMetric: (namespace, key, value) =>
      set((s) => ({
        metrics: {
          ...s.metrics,
          [namespace]: { ...(s.metrics[namespace] ?? {}), [key]: value },
        },
      })),
    setMetrics: (namespace, values) =>
      set((s) => ({
        metrics: {
          ...s.metrics,
          [namespace]: { ...(s.metrics[namespace] ?? {}), ...values },
        },
      })),
    clear: (namespace) =>
      set((s) =>
        namespace
          ? {
              metrics: Object.fromEntries(
                Object.entries(s.metrics).filter(([ns]) => ns !== namespace)
              ),
            }
          : { metrics: {} }
      ),
  })
);
