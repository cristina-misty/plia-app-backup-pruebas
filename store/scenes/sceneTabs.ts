"use client";

import { create } from "zustand";

/**
 * Store global para manejar la pestaña activa en la vista de escenas.
 * Mantiene un estado mínimo para evitar problemas de rendimiento.
 */
interface SceneTabsState {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  reset: () => void;
}

export const useSceneTabsStore = create<SceneTabsState>((set) => ({
  activeTab: "",
  setActiveTab: (tab) => set({ activeTab: tab }),
  reset: () => set({ activeTab: "" }),
}));
