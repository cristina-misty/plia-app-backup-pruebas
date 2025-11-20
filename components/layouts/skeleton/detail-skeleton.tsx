"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function DetailSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/5" />
      <Skeleton className="h-4 w-2/6" />
    </div>
  );
}
