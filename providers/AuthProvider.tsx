"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { usePusher } from "@/lib/pusher/usePusher";
import { useSeries } from "@/hooks/api/useSeries";
import { useEffect, useRef } from "react";
import { useSeriesStore } from "@/store/series/series";

function PusherInitializer() {
  usePusher();
  return null;
}

function SeriesLoader() {
  const { data: session, status } = useSession();
  const { series } = useSeriesStore();
  const { getSeries } = useSeries(); // usamos sólo la función, no auto-fetch
  const hasFetched = useRef(false);

  useEffect(() => {
    // 🧠 Solo ejecutar si:
    // - la sesión está cargada y hay usuario
    // - no se ha hecho el fetch antes
    // - y no hay series guardadas aún
    if (
      status === "authenticated" &&
      session?.user?.id &&
      !hasFetched.current &&
      !series
    ) {
      console.log("📦 Usuario autenticado, cargando series una sola vez...");
      hasFetched.current = true;
      getSeries(session?.user?.id);
    }
  }, [status, session?.user?.id, getSeries, series]);

  return null;
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <PusherInitializer />
      <SeriesLoader />
      {children}
    </SessionProvider>
  );
}
