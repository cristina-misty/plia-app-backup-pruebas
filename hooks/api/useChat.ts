"use client";

import { useChatStore } from "@/store/chatbot/chatbot";

export function useChat() {
  const {
    messages,
    assistantLoading,
    error,
    sendMessage,
    addMessage,
    clearMessages,
  } = useChatStore();

  return {
    messages,
    assistantLoading,
    error,
    sendMessage,
    addMessage,
    clearMessages,
  };
}
