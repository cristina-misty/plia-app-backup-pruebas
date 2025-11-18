"use client";

import Pusher from "pusher-js";

// ⚙️ Configuración cliente (usa variables públicas)
export const pusherClient = new Pusher(
  process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    channelAuthorization: {
      endpoint: "/api/pusher/auth",
      transport: "ajax",
    },
    forceTLS: true,
  }
);
