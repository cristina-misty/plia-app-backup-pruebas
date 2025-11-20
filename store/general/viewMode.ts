import { create } from "zustand";

export type ViewMode = "table" | "cards" | "charts";

type NamespacedViewMode = Record<string, ViewMode>;

type ViewModeState = {
  global?: ViewMode;
  namespaces: NamespacedViewMode;
  set: (namespace: string, mode: ViewMode) => void;
  clear: (namespace?: string) => void;
  setGlobal: (mode: ViewMode) => void;
  clearGlobal: () => void;
};

export const useViewModeStore = create<ViewModeState>((set) => ({
  global: undefined,
  namespaces: {},
  set: (namespace, mode) =>
    set((s) => ({ namespaces: { ...s.namespaces, [namespace]: mode } })),
  clear: (namespace) =>
    set((s) => {
      if (!namespace) return { namespaces: {} };
      const next = { ...s.namespaces };
      delete next[namespace];
      return { namespaces: next };
    }),
  setGlobal: (mode) => set(() => ({ global: mode })),
  clearGlobal: () => set(() => ({ global: undefined })),
}));
