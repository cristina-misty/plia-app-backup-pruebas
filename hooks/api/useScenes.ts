"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSeriesStore } from "@/store/series/series";
import { useScenesStore } from "@/store/scenes/scenes";

export function useScenes(
  options: { autoFetch?: boolean; force?: boolean } = {}
) {
  const { autoFetch = false, force = false } = options;
  const { data: session } = useSession();
  const {
    scenes,
    loading,
    error,
    getScenes,
    setScenes,
    clearScenes,
    lastProfileUuid,
    lastSerieUuid,
  } = useScenesStore();
  const { currentSerie } = useSeriesStore();

  useEffect(() => {
    const hasSession = !!session?.user?.id;
    const hasSerie = !!currentSerie?.serie_uuid;
    const sameContext =
      hasSession &&
      hasSerie &&
      lastProfileUuid === session!.user!.id &&
      lastSerieUuid === currentSerie!.serie_uuid;

    const shouldFetch =
      autoFetch && hasSession && hasSerie && (force || !sameContext || !scenes);

    if (shouldFetch) {
      /*   console.log(
        "📍 Cargando scenes para serie:",
        currentSerie.serie_title
      ); */
      getScenes(session.user.id, currentSerie.serie_uuid);
    }

    // Limpia scenes si el usuario cierra sesión
    if (!session) {
      clearScenes();
    }
  }, [
    session?.user?.id,
    currentSerie?.serie_uuid,
    autoFetch,
    force,
    scenes,
    lastProfileUuid,
    lastSerieUuid,
    getScenes,
    clearScenes,
  ]);

  return {
    scenes,
    loading,
    error,
    getScenes,
    setScenes,
    clearScenes,
  };
}
