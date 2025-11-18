"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

interface SectionLayoutClientProps {
  children: React.ReactNode;
  title?: string;
}

export function SectionLayoutClient({
  children,
  title,
}: SectionLayoutClientProps) {
  const { status } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="p-8 space-y-6">
        {title ? <h1 className="text-2xl font-bold">{title}</h1> : null}
        <div className="flex items-center gap-2 text-muted-foreground">
          <Spinner className="size-5" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {title ? <h1 className="text-2xl font-bold">{title}</h1> : null}
      {children}
    </div>
  );
}