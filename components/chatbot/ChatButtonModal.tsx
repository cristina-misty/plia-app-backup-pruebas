"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BotMessageSquare } from "lucide-react";
import Chat from "./Chat";
import { Composer } from "./Composer";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function ChatButtonModal() {
  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              size="icon"
              variant="default"
              className="fixed bottom-10 right-10 z-50 shadow-lg rounded-full size-12"
            >
              <BotMessageSquare className="size-8" />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Open AI Plia Assistant</p>
        </TooltipContent>
      </Tooltip>

      <PopoverContent className="w-[30vw] h-[85dvh] p-0 flex flex-col overflow-hidden mb-2 mr-4">
        {/* HEADER */}
        <div className="flex items-center gap-2 p-4 border-b bg-background shrink-0">
          <BotMessageSquare className="size-8" />
          <h4 className="font-bold text-lg">PLIA Assistant</h4>
        </div>

        {/* CHAT CONTENT SCROLLABLE */}
        <div className="flex-1 overflow-y-auto p-4">
          <Chat />
        </div>

        <Composer model="llama3.2" />
      </PopoverContent>
    </Popover>
  );
}
