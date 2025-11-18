"use client";

import { Spinner } from "@/components/ui/spinner";
import { useChatStore } from "@/store/chatbot/chatbot";
import { MessageList } from "./MessageList";
import { Combobox } from "../ui/combobox";

export default function Chat() {
  const { assistantLoading } = useChatStore();

  const chatbots = [
    {
      value: "screenplay",
      label: "Screenplay",
    },
    {
      value: "1ad",
      label: "1AD",
    },
  ];

  return (
    <div className="max-w-lg flex flex-col flex-1 overflow-hidden">
      <div className="w-full flex p-2">
        <Combobox options={chatbots} placeholder="Select chatbot..." />
      </div>
      <MessageList assistantLoading={assistantLoading} />
      {assistantLoading && (
        <div className="flex items-center gap-2 text-muted-foreground px-2 py-2">
          <Spinner className="size-4" />
          <span>Generando respuesta...</span>
        </div>
      )}
    </div>
  );
}
