"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useDocsStore } from "@/store/docs/docs";
import { useSeriesStore } from "@/store/series/series";

// Mantiene el mismo estilo y flujo que useScenes.ts
export function useDocs(
  options: { autoFetch?: boolean; force?: boolean } = {}
) {
  const { autoFetch = false, force = false } = options;
  const { data: session } = useSession();
  const { docs, loading, error, getDocs, setDocs, clearDocs } = useDocsStore();
  const { currentSerie } = useSeriesStore();

  useEffect(() => {
    const hasSession = !!session?.user?.id;
    const hasSerie = !!currentSerie?.serie_uuid;

    // Sin lastProfileUuid/lastSerieUuid en el store de docs, usamos la presencia de docs
    const shouldFetch = autoFetch && hasSession && hasSerie && (force || !docs);

    if (shouldFetch) {
      /* console.log("📄 Cargando docs para serie:", currentSerie!.serie_title); */
      getDocs(session!.user!.id, currentSerie!.serie_uuid);
    }

    // Limpia docs si el usuario cierra sesión
    if (!session) {
      clearDocs();
    }
  }, [
    session?.user?.id,
    currentSerie?.serie_uuid,
    autoFetch,
    force,
    docs,
    getDocs,
    clearDocs,
  ]);

  return {
    docs,
    loading,
    error,
    getDocs,
    setDocs,
    clearDocs,
  };
}
