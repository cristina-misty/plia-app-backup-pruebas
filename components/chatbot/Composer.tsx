"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useChatStore } from "@/store/chatbot/chatbot";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { CircleStop } from "lucide-react";

export function Composer({ model }: { model?: string }) {
  const [text, setText] = useState("");
  const { sendMessage, assistantLoading, stopAssistant } = useChatStore();
  const { data: session } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !session?.user?.id) return;
    await sendMessage(text, session.user.id);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-2">
      <Textarea
        placeholder="Escribe un mensaje y presiona Enter..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) =>
          !assistantLoading && e.key === "Enter" && handleSubmit(e)
        }
        disabled={assistantLoading}
      />
      {assistantLoading ? (
        <Button
          type="button"
          onClick={stopAssistant}
          variant="destructive"
          className="cursor-pointer w-full"
          title="stop"
        >
          <CircleStop className="mr-2 h-4 w-4" />
          Cancelar solicitud
        </Button>
      ) : (
        <Button
          type="submit"
          disabled={!text.trim()}
          className="cursor-pointer w-full"
        >
          Enviar
        </Button>
      )}
    </form>
  );
}
