"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/lib/pusher/pusherClient";

export default function PusherProvider() {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user?.id) return;

    const channelName = `private-user_${session.user.id}`;
    //console.log(`🟢 Conectando a canal: ${channelName}`);

    const channel = pusherClient.subscribe(channelName);

    channel.bind("pusher:subscription_succeeded", () => {
      //console.log(`✅ Subscrito correctamente a ${channelName}`);
    });

    channel.bind(
      "pusher:subscription_error",
      (err: { type: string; error: string }) => {
        console.error("❌ Error al suscribirse:", err);
      }
    );

    channel.bind("my-event", (data: unknown) => {
      //console.log("📩 Evento recibido:", data);
    });

    // Limpieza al desmontar (si la pestaña se cierra o refresca)
    return () => {
      pusherClient.unsubscribe(channelName);
      //console.log(`🔴 Desconectado de ${channelName}`);
    };
  }, [session?.user?.id]);

  return null;
}
