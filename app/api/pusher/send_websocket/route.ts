import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { pusherServer } from "@/lib/pusher/pusherServer";
import { authOptions } from "@/lib/auth-options";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      console.error("❌ No hay sesión activa en /api/pusher/send_websocket");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { profile_uuid, pusher_data } = body;

    if (!profile_uuid || !pusher_data?.event_name) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const channel = `private-user_${profile_uuid}`;
    const { event_name, ...rest } = pusher_data;

    //console.log(`📤 Enviando evento '${event_name}' al canal '${channel}'`);

    await pusherServer.trigger(channel, event_name, {
      from: session.user.email,
      ...rest,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error en /api/pusher/send_websocket:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
