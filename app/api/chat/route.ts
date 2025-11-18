import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { pusherServer } from "@/lib/pusher/pusherServer";
import { authOptions } from "@/lib/auth-options";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // Obtener sesión para construir el canal privado del usuario
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const channel = `private-user_${userId}`;

    const ollamaUrl = process.env.OLLAMA_HOST || "http://localhost:11434";
    const model = process.env.OLLAMA_MODEL || "llama3.2";

    // Emitir el mensaje del usuario vía Pusher
    try {
      await pusherServer.trigger(channel, "chat:message", {
        role: "user",
        text: message,
        ts: Date.now(),
      });
      // Compatibilidad: evento legacy (solo si está habilitado por variable de entorno)
      if (process.env.PUSHER_EMIT_LEGACY === "true") {
        await pusherServer.trigger(channel, "new-message", {
          role: "user",
          text: message,
          message,
          ts: Date.now(),
        });
      }
    } catch (e) {
      console.warn("⚠️ No se pudo emitir mensaje de usuario a Pusher", e);
    }

    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        prompt: message,
        // Solicitar respuesta no streaming para poder hacer response.json() directamente
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error("Error al contactar con Ollama");
    }

    const result = await response.json();

    // Con stream: false, Ollama responde con un objeto único
    const reply = result.response ?? result.output_text ?? "Sin respuesta";

    // Emitir la respuesta del asistente vía Pusher
    try {
      await pusherServer.trigger(channel, "chat:message", {
        role: "assistant",
        text: reply,
        ts: Date.now(),
      });
      // Compatibilidad: evento legacy (solo si está habilitado por variable de entorno)
      if (process.env.PUSHER_EMIT_LEGACY === "true") {
        await pusherServer.trigger(channel, "new-message", {
          role: "assistant",
          text: reply,
          message: reply,
          ts: Date.now(),
        });
      }
    } catch (e) {
      console.warn("⚠️ No se pudo emitir respuesta del asistente a Pusher", e);
    }

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: "Error al generar respuesta" },
      { status: 500 }
    );
  }
}
