"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useProfileStore } from "@/store/profile/profile";

export function useProfile(autoFetch: boolean = false) {
  const { data: session } = useSession();
  const { profile, loading, error, getProfile, clearProfile } =
    useProfileStore();

  // 🔹 Si autoFetch=true, carga el perfil automáticamente cuando hay sesión
  useEffect(() => {
    if (autoFetch && session?.user?.id) {
      getProfile(session.user.id);
    }

    // Limpia el perfil si el usuario cierra sesión
    if (!session) {
      clearProfile();
    }
  }, [session, autoFetch, getProfile, clearProfile]);

  return {
    profile,
    loading,
    error,
    getProfile,
  };
}
