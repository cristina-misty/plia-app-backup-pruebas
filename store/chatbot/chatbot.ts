"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface ChatState {
  messages: ChatMessage[];
  assistantLoading: boolean;
  error: string | null;
  sendMessage: (text: string, userId: string) => Promise<void>;
  addMessage: (msg: ChatMessage) => void;
  clearMessages: () => void;
  stopAssistant: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      assistantLoading: false,
      error: null,

      addMessage: (msg) =>
        set((state) => ({
          messages: [...state.messages, msg],
        })),

      clearMessages: () => set({ messages: [], error: null }),

      // Detiene el estado de "cargando" del asistente (UI cancelación)
      stopAssistant: () => set({ assistantLoading: false }),

      sendMessage: async (text, userId) => {
        if (!text.trim()) return;

        const userMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: "user",
          content: text,
          timestamp: Date.now(),
        };

        set((state) => ({
          messages: [...state.messages, userMessage],
          assistantLoading: true,
        }));

        try {
          // Envía el mensaje al endpoint local de Next.js (/api/chat)
          // Evitamos pasar por /api/proxy para reducir 404 cuando no existe backend remoto
          const res = await axios.post<{ reply: string }>("/api/chat", {
            message: text,
          });
          const data = res.data;

          // Añadimos la respuesta del asistente
          const botMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: "assistant",
            content: data.reply,
            timestamp: Date.now(),
          };

          set((state) => ({
            messages: [...state.messages, botMessage],
            assistantLoading: false,
          }));
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Error al enviar mensaje";
          console.error("❌ Chat error:", message, err);
          set({ assistantLoading: false, error: message });
        }
      },
    }),
    {
      name: "plia-chat-store",
      // Persistencia basada en sesión: usa sessionStorage en lugar de localStorage
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

// --- Limpieza automática al finalizar la sesión ---
// Detecta fin de sesión y limpia el store para garantizar que los datos
// solo permanezcan durante la sesión activa del usuario.
// No requiere cambios en el código consumidor.
if (typeof window !== "undefined") {
  const CLEAR_KEY = "plia-chat-store";

  // Evita múltiples inicializaciones en caso de HMR o renders duplicados
  const globalAny = window as unknown as {
    __plia_chat_cleanup_initialized?: boolean;
  };

  if (!globalAny.__plia_chat_cleanup_initialized) {
    globalAny.__plia_chat_cleanup_initialized = true;

    const clearChatStore = () => {
      try {
        // Limpia el estado en memoria
        useChatStore.getState().clearMessages();
        // Limpia la persistencia en sessionStorage
        useChatStore.persist.clearStorage();
        sessionStorage.removeItem(CLEAR_KEY);
      } catch (e) {
        console.warn(
          "[ChatStore] No se pudo limpiar el almacenamiento de sesión:",
          e
        );
      }
    };

    const checkSession = async () => {
      try {
        // Consulta la sesión actual de NextAuth; si no hay usuario, limpiar.
        const res = await fetch("/api/auth/session", {
          credentials: "include",
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!data?.user) {
          clearChatStore();
        }
      } catch (e) {
        // Silencioso: en caso de error de red, no hacemos nada.
      }
    };

    // Verifica al ganar foco (típico tras redirección a /login o volver a la pestaña)
    window.addEventListener("focus", checkSession);
    // Verifica al cambiar visibilidad (p. ej., al volver a la app)
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") checkSession();
    });
    // Verificación periódica de baja frecuencia para detectar expiración silenciosa
    const intervalId = window.setInterval(checkSession, 60_000); // cada 60s

    // Si se detecta una recarga de página (común tras reinicio del servidor en dev), limpia el store
    try {
      const navEntries = (performance?.getEntriesByType?.("navigation") ||
        []) as Array<PerformanceNavigationTiming & { type?: string }>;
      const navType =
        navEntries[0]?.type ||
        (performance as unknown as { navigation?: { type?: string } })
          ?.navigation?.type; // fallback legacy
      if (navType === "reload") {
        clearChatStore();
      }
    } catch {}

    // Limpia el intervalo cuando se descarga la página
    window.addEventListener("beforeunload", () => {
      window.clearInterval(intervalId);
    });
  }
}
