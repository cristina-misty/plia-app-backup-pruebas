"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSeriesStore } from "@/store/series/series";
import { useCharactersStore } from "@/store/characters/characters";

export function useCharacters(
  options: { autoFetch?: boolean; force?: boolean } = {}
) {
  const { autoFetch = false, force = false } = options;
  const { data: session } = useSession();
  const {
    characters,
    loading,
    error,
    getCharacters,
    lastProfileUuid,
    lastSerieUuid,
    clearCharacters,
  } = useCharactersStore();
  const { currentSerie } = useSeriesStore();

  useEffect(() => {
    const hasSession = !!session?.user?.id;
    const hasSerie = !!currentSerie?.serie_uuid;

    // Comprobamos si ya tenemos los datos para esta combinación
    const sameContext =
      hasSession &&
      hasSerie &&
      lastProfileUuid === session!.user!.id &&
      lastSerieUuid === currentSerie!.serie_uuid;

    const shouldFetch =
      autoFetch &&
      hasSession &&
      hasSerie &&
      (force || !sameContext || !characters);

    if (shouldFetch && session?.user?.id && currentSerie?.serie_uuid) {
      /*  console.log(
        "📍 Cargando characters para serie:",
        currentSerie?.serie_title
      ); */
      getCharacters(session.user.id, currentSerie.serie_uuid);
    }

    // Limpiamos si cierra sesión
    if (!hasSession) {
      clearCharacters();
    }
  }, [
    session?.user?.id,
    currentSerie?.serie_uuid,
    autoFetch,
    force,
    characters,
    lastProfileUuid,
    lastSerieUuid,
    getCharacters,
    clearCharacters,
  ]);

  return { characters, loading, error, getCharacters, clearCharacters };
}
