"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSeriesStore } from "@/store/series/series";
import { useLocationsStore } from "@/store/locations/locations";

export function useLocations(
  options: { autoFetch?: boolean; force?: boolean } = {}
) {
  const { autoFetch = false, force = false } = options;
  const { data: session } = useSession();
  const {
    locations,
    loading,
    error,
    getLocations,
    setLocations,
    clearLocations,
    lastProfileUuid,
    lastSerieUuid,
  } = useLocationsStore();
  const { currentSerie } = useSeriesStore();

  useEffect(() => {
    // Solo llamar a getLocations cuando hay usuario Y serie seleccionada
    const hasSession = !!session?.user?.id;
    const hasSerie = !!currentSerie?.serie_uuid;
    const sameContext =
      hasSession &&
      hasSerie &&
      lastProfileUuid === session!.user!.id &&
      lastSerieUuid === currentSerie!.serie_uuid;

    const shouldFetch =
      autoFetch &&
      hasSession &&
      hasSerie &&
      (force || !sameContext || !locations);

    if (shouldFetch) {
      /*   console.log(
        "📍 Cargando locations para serie:",
        currentSerie.serie_title
      ); */
      getLocations(session.user.id, currentSerie.serie_uuid);
    }

    // Limpia locations si el usuario cierra sesión
    if (!session) {
      clearLocations();
    }
  }, [
    session?.user?.id,
    currentSerie?.serie_uuid,
    autoFetch,
    force,
    locations,
    lastProfileUuid,
    lastSerieUuid,
    getLocations,
    clearLocations,
  ]);

  return {
    locations,
    loading,
    error,
    getLocations,
    setLocations,
    clearLocations,
  };
}
