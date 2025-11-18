"use client";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { BotMessageSquare } from "lucide-react";
import Chat from "./Chat";
import { Composer } from "./Composer";

export function ChatRoundedButton() {
  return (
    <Sheet>
      {/* 🔘 Botón flotante */}
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="default"
          className="fixed bottom-10 right-10 z-50 shadow-lg rounded-full size-12"
        >
          <BotMessageSquare className="size-8" />
        </Button>
      </SheetTrigger>

      {/* 🧱 Panel lateral */}
      <SheetContent
        side="right"
        className="w-[95%] h-[98dvh] m-2 rounded-2xl gap-0!"
      >
        <SheetHeader className="flex flex-row justify-between items-center border-b pb-2">
          <div className="flex items-center gap-2">
            <BotMessageSquare className="size-10" />
            <div className="flex flex-col">
              <SheetTitle>PLIA Assistant</SheetTitle>
              <SheetDescription>AI Chat</SheetDescription>
            </div>
          </div>
          <SheetClose asChild></SheetClose>
        </SheetHeader>
        {/*  -----CHATBOT----- */}
        <Chat />
        <Composer model="llama3.2" />
      </SheetContent>
    </Sheet>
  );
}
