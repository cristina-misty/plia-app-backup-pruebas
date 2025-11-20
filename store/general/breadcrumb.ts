import { create } from "zustand";

interface BreadcrumbState {
  detailLabel: string | null;
  setDetailLabel: (label: string) => void;
  clearDetailLabel: () => void;
}

export const useBreadcrumbStore = create<BreadcrumbState>((set) => ({
  detailLabel: null,
  setDetailLabel: (label) => set({ detailLabel: label ?? null }),
  clearDetailLabel: () => set({ detailLabel: null }),
}));

