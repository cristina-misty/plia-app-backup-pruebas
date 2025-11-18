import { create } from "zustand";

interface FilteredSeriesState {
  query: string;
  setQuery: (q: string) => void;
  clear: () => void;
}

export const useFilteredSeriesStore = create<FilteredSeriesState>((set) => ({
  query: "",
  setQuery: (q) => set({ query: q }),
  clear: () => set({ query: "" }),
}));
