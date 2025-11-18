"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { proxyCall } from "@/lib/proxy/proxyClient";
import { SeriesPayload, SeriesResponse } from "@/types/api/series";
import { toastError } from "@/lib/ui/toastService";

interface SeriesState {
  series: SeriesResponse[] | null;
  currentSerie: SeriesResponse | null;
  lastProfileUuid: string | null;
  loading: boolean;
  error: string | null;
  getSeries: (profile_uuid: string) => Promise<SeriesResponse[] | null>;
  setSeries: (series: SeriesResponse[]) => void;
  setCurrentSerie: (serie: SeriesResponse) => void;
  clearSeries: () => void;
}

export const useSeriesStore = create<SeriesState>()(
  persist(
    (set) => ({
      series: null,
      currentSerie: null,
      lastProfileUuid: null,
      loading: false,
      error: null,

      getSeries: async (profile_uuid: string) => {
        try {
          set({ loading: true, error: null });

          const body: SeriesPayload = { profile_uuid };
          const data = await proxyCall<SeriesResponse[], SeriesPayload>(
            "/series",
            "POST",
            body
          );

          // Leer serie activa guardada en localStorage
          const storedId =
            typeof window !== "undefined"
              ? window.localStorage.getItem("plia:selectedSerieId")
              : null;

          const persistedSerie = storedId
            ? data.find((s) => s.serie_uuid === storedId)
            : null;

          set({
            series: data,
            currentSerie: persistedSerie ?? data?.[0] ?? null,
            lastProfileUuid: profile_uuid,
            loading: false,
          });

          return data;
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Error al obtener series";
          console.error("❌ Error en getSeries:", message);
          toastError(`No hay series con este perfil`, message);
          set({ error: message, loading: false });
          return null;
        }
      },

      setSeries: (series) => set({ series }),

      setCurrentSerie: (serie) => {
        /*   console.log(
          "[SeriesStore] setCurrentSerie:",
          serie?.serie_uuid,
          serie?.serie_title
        ); */
        set({ currentSerie: serie });
      },

      clearSeries: () =>
        set({
          series: null,
          currentSerie: null,
          lastProfileUuid: null,
          error: null,
          loading: false,
        }),
    }),
    {
      name: "plia-series-store",
    }
  )
);
