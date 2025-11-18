import { create } from "zustand";

interface SelectedSceneStore {
  selected: any | null;
  setSelected: (data: any) => void;
  clear: () => void;
}

export const useSelectedSceneStore = create<SelectedSceneStore>((set) => ({
  selected:
    typeof window !== "undefined"
      ? JSON.parse(sessionStorage.getItem("selectedScene") || "null")
      : null,

  setSelected: (data) => {
    set({ selected: data });
    if (typeof window !== "undefined") {
      sessionStorage.setItem("selectedScene", JSON.stringify(data));
    }
  },

  clear: () => {
    set({ selected: null });
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("selectedScene");
    }
  },
}));
