"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSeriesStore } from "@/store/series/series";

// Alineado con useLocations: acepta options { autoFetch, force }
export function useSeries(
  options: { autoFetch?: boolean; force?: boolean } = {}
) {
  const { autoFetch = false, force = false } = options;
  const { data: session } = useSession();
  const { series, loading, error, getSeries, clearSeries, lastProfileUuid } =
    useSeriesStore();

  useEffect(() => {
    const hasSession = !!session?.user?.id;
    const sameContext = hasSession && lastProfileUuid === session!.user!.id;

    const shouldFetch =
      autoFetch && hasSession && (force || !sameContext || !series);

    if (shouldFetch) {
      getSeries(session!.user!.id);
    }

    if (!session) {
      clearSeries();
    }
  }, [
    session?.user?.id,
    autoFetch,
    force,
    series,
    lastProfileUuid,
    getSeries,
    clearSeries,
  ]);

  return { series, loading, error, getSeries, clearSeries };
}
