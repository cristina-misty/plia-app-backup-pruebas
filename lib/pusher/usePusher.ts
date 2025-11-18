"use client";

import { useEffect, useRef } from "react";
import { pusherClient } from "@/lib/pusher/pusherClient";
import { useSession } from "next-auth/react";

/**
 * Mantiene una conexión viva con Pusher mientras el usuario esté autenticado.
 * Solo crea una conexión por sesión y se limpia automáticamente al cerrar sesión.
 */
export function usePusher() {
  const { data: session } = useSession();
  const hasConnectedRef = useRef(false); // evita reconexiones múltiples

  useEffect(() => {
    // 🔸 Si no hay sesión, desconecta (por ejemplo al cerrar sesión)
    if (!session?.user?.id) {
      if (hasConnectedRef.current) {
        ////console.log("🔴 Desconectando de Pusher: sesión terminada");
        pusherClient.disconnect();
        hasConnectedRef.current = false;
      }
      return;
    }

    // 🔸 Si ya estás conectado, no hagas nada
    if (hasConnectedRef.current) return;

    const channelName = `private-user_${session.user.id}`;
    //console.log(`🟢 Conectando a canal: ${channelName}`);

    // Conecta (solo una vez)
    const channel = pusherClient.subscribe(channelName);

    // Escucha del evento moderno de chat
    channel.bind(
      "chat:message",
      (data: { role: "user" | "assistant"; text: string; ts?: number }) => {
        //console.log("📡 chat:message recibido:", data);
        const who = data.role === "assistant" ? "Asistente" : "Usuario";
      }
    );

    // Mantener compatibilidad con pruebas antiguas usando "new-message"
    channel.bind(
      "new-message",
      (data: {
        message?: string;
        text?: string;
        role?: string;
        ts?: number;
      }) => {
        //console.log("📡 new-message recibido:", data);
        const text = data.text ?? data.message ?? "(sin texto)";
        const who = data.role === "assistant" ? "Asistente" : "Usuario";
      }
    );

    pusherClient.connection.bind("connected", () => {
      //console.log("✅ Conectado a Pusher");
    });

    pusherClient.connection.bind("disconnected", () => {
      //console.log("⚠️ Desconectado de Pusher");
    });

    hasConnectedRef.current = true;

    // 🔹 Limpieza cuando el usuario cierre sesión
    return () => {
      //console.log(`🧹 Cerrando canal ${channelName}`);
      pusherClient.unsubscribe(channelName);
      pusherClient.disconnect();
      hasConnectedRef.current = false;
    };
  }, [session?.user?.id]);
}
