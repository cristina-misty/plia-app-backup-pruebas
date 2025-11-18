"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useDataStore } from "@/store/data/data";

export function useData(autoFetch: boolean = false) {
  const { data: session } = useSession();
  const { dataUser, loading, error, getDataUser, clearDataUser } =
    useDataStore();

  // 🔹 Si autoFetch=true, carga el data automáticamente cuando hay sesión
  useEffect(() => {
    if (autoFetch && session?.user?.id) {
      getDataUser(session.user.id);
    }

    // Limpia el data si el usuario cierra sesión
    if (!session) {
      clearDataUser();
    }
  }, [session, autoFetch, getDataUser, clearDataUser]);

  return {
    dataUser,
    loading,
    error,
    getDataUser,
  };
}
