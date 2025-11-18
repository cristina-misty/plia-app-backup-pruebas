"use client";

import { Toaster } from "@/components/ui/sonner";

export default function ToasterProvider() {
  return (
    <Toaster
      theme="system"
      position="top-right"
      richColors
      closeButton
      expand={true}
      toastOptions={{
        duration: 3500,
      }}
    />
  );
}
