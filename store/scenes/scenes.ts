"use client";

import { create } from "zustand";
import { proxyCall } from "@/lib/proxy/proxyClient";
import { toastSuccess, toastError } from "@/lib/ui/toastService";
import {
  ScenesResponse,
  ScenesApiResponse,
  SecenesPayload,
} from "@/types/api/scenes";

interface ScenesState {
  scenes: ScenesResponse | null;
  lastProfileUuid: string | null;
  lastSerieUuid: string | null;
  loading: boolean;
  error: string | null;
  getScenes: (
    profile_uuid: string,
    serie_uuid: string
  ) => Promise<ScenesResponse | null>;
  setScenes: (data: ScenesResponse) => void;
  clearScenes: () => void;
}

export const useScenesStore = create<ScenesState>((set) => ({
  scenes: null,
  lastProfileUuid: null,
  lastSerieUuid: null,
  loading: false,
  error: null,

  getScenes: async (profile_uuid: string, serie_uuid: string) => {
    try {
      set({ loading: true, error: null });

      const body: SecenesPayload = { profile_uuid, serie_uuid };

      const data = await proxyCall<ScenesApiResponse, SecenesPayload>(
        "/curated_scenes",
        "POST",
        body
      );

      console.log("✅ Scenes obtenidos:", data?.scenes);

      const scenesOnly = data?.scenes ?? [];

      set({
        scenes: scenesOnly,
        lastProfileUuid: profile_uuid,
        lastSerieUuid: serie_uuid,
        loading: false,
      });

      toastSuccess(`Scenes cargados: ${scenesOnly.length}`);
      return scenesOnly;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al obtener data";
      console.error("❌ Error en getScenes:", message);
      set({ error: message, loading: false });
      toastError("Error al obtener scenes", message);
      return null;
    }
  },

  setScenes: (data) => {
    set({ scenes: data });
    toastSuccess(`Scenes actualizados: ${data.length}`);
  },

  clearScenes: () => {
    set({
      scenes: null,
      lastProfileUuid: null,
      lastSerieUuid: null,
      error: null,
      loading: false,
    });
  },
}));
