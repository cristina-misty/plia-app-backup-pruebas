import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { pusherServer } from "@/lib/pusher/pusherServer";
import { authOptions } from "@/lib/auth-options";

export async function POST(req: Request) {
  try {
    // ✅ Solo pasa authOptions, sin cookies()
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      console.error("❌ No hay sesión activa en /api/pusher/auth");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🔎 Pusher envía por defecto application/x-www-form-urlencoded con transport "ajax"
    // Aceptamos tanto JSON como form-urlencoded para evitar 500 por parseo
    const contentType = req.headers.get("content-type") || "";
    let socket_id: string | null = null;
    let channel_name: string | null = null;

    if (contentType.includes("application/json")) {
      const body = await req.json();
      socket_id = body?.socket_id ?? null;
      channel_name = body?.channel_name ?? null;
    } else {
      const raw = await req.text();
      const params = new URLSearchParams(raw);
      socket_id = params.get("socket_id");
      channel_name = params.get("channel_name");
    }

    if (!socket_id || !channel_name) {
      console.error("❌ Faltan parámetros en body", {
        socket_id,
        channel_name,
        contentType,
      });
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // ✅ Validar que el canal corresponde al usuario autenticado
    const expectedChannel = `private-user_${session.user.id}`;
    if (channel_name !== expectedChannel) {
      console.warn("🚫 Canal no autorizado para el usuario", {
        userId: session.user.id,
        channel_name,
        expectedChannel,
      });
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const authResponse = pusherServer.authorizeChannel(
      socket_id,
      channel_name,
      {
        user_id: session.user.id,
      }
    );

    return NextResponse.json(authResponse);
  } catch (error) {
    console.error("❌ Error interno en /api/pusher/auth:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
