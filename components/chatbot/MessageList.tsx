"use client";

import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/chatbot/chatbot";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { useEffect, useRef } from "react";

interface MessageListProps {
  assistantLoading?: boolean;
}

export function MessageList({ assistantLoading }: MessageListProps) {
  const { messages } = useChatStore();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = scrollRef.current;
    const anchor = endRef.current;
    if (!container || !anchor) return;

    // siempre que haya mensajes o esté generando respuesta, baja
    requestAnimationFrame(() => {
      setTimeout(() => {
        anchor.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 30);
    });
  }, [messages.length, assistantLoading]); // 👈 se añade aquí

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 p-2">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={cn(
            "rounded-lg px-4 py-3 max-w-[80%] prose prose-sm dark:prose-invert wrap-break-word",
            msg.role === "user"
              ? "bg-blue-500 text-white ml-auto prose-invert"
              : "bg-muted text-foreground"
          )}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkBreaks]}
            components={{
              li: ({ children }) => (
                <li className="list-disc ml-4">{children}</li>
              ),
              ul: ({ children }) => (
                <ul className="list-disc ml-4">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal ml-4">{children}</ol>
              ),
              p: ({ children }) => (
                <p className="mb-2 leading-relaxed">{children}</p>
              ),
            }}
          >
            {msg.content}
          </ReactMarkdown>
        </div>
      ))}

      {/* ancla al final */}
      <div ref={endRef} />
    </div>
  );
}
