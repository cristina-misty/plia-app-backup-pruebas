import { create } from "zustand";

interface ScenesFilterState {
  filter?: string;
  filters: string[];
  setFilter: (v: string) => void;
  setFilters: (v: string[]) => void;
  toggleFilter: (v: string) => void;
  clear: () => void;
  clearFilters: () => void;
}

export const useScenesFilterStore = create<ScenesFilterState>((set, get) => ({
  filter: undefined,
  filters: [],
  setFilter: (v) => set({ filter: v }),
  setFilters: (v) => set({ filters: Array.isArray(v) ? v : [] }),
  toggleFilter: (v) => {
    const current = new Set<string>(get().filters);
    if (current.has(v)) current.delete(v);
    else current.add(v);
    set({ filters: Array.from(current) });
  },
  clear: () => set({ filter: undefined }),
  clearFilters: () => set({ filters: [] }),
}));
