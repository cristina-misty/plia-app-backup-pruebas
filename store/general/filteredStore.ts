import { create } from "zustand";

interface FilteredStoreState {
  query: string;
  setQuery: (q: string) => void;
  clear: () => void;
}

export const useFilteredStore = create<FilteredStoreState>((set) => ({
  query: "",
  setQuery: (q) => set({ query: q }),
  clear: () => set({ query: "" }),
}));
