"use client";

import { create } from "zustand";
import { proxyCall } from "@/lib/proxy/proxyClient";
import { ProfilePayload, ProfileResponse } from "@/types/api/profile";
import { toastError, toastInfo, toastSuccess } from "@/lib/ui/toastService";

interface ProfileState {
  profile: ProfileResponse | null;
  loading: boolean;
  error: string | null;
  getProfile: (profile_uuid: string) => Promise<ProfileResponse | null>;
  setProfile: (profile: ProfileResponse) => void;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  loading: false,
  error: null,

  getProfile: async (profile_uuid: string) => {
    try {
      set({ loading: true, error: null });

      const body: ProfilePayload = { profile_uuid };
      const data = await proxyCall<ProfileResponse, ProfilePayload>(
        "/profile",
        "POST",
        body
      );

      console.log("✅ Perfil obtenido:", data);

      set({ profile: data, loading: false });

      toastSuccess(`Perfil cargado: ${data.name}`);

      return data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al obtener perfil";
      console.error("❌ Error en getProfile:", message);
      set({ error: message, loading: false });
      toastError("Error al obtener perfil", message);
      return null;
    }
  },

  setProfile: (profile) => {
    set({ profile });
    toastSuccess(`Perfil actualizado: ${profile.name}`);
  },

  clearProfile: () => {
    set({ profile: null, error: null, loading: false });
    toastInfo("Datos de usuario eliminados");
  },
}));
