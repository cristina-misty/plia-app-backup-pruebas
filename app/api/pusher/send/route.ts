import { pusherServer } from "@/lib/pusher/pusherServer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { channel, event, payload } = await req.json();

  await pusherServer.trigger(channel, event, payload);

  return NextResponse.json({ success: true });
}
