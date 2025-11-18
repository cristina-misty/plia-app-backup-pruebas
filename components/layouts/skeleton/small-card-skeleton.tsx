import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const SmallCardSkeleton = () => {
  return (
    <Card className="max-w-sm">
      <CardContent>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-40" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmallCardSkeleton;
