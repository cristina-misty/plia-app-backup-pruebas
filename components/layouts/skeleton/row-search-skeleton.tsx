import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const RowSearchSkeleton = () => {
  return (
    <div className="flex items-center justify-center gap-2">
      <Card className="h-8 w-5/6">
        <div className="h-full w-full flex items-center justify-center">
          <Skeleton className="h-6 w-full mx-4" />
        </div>
      </Card>
      <div className="w-1/6 flex items-center justify-center gap-2">
        <Card className="w-full" />
        <Card className="w-full" />
        <Card className="w-full" />
      </div>
    </div>
  );
};

export default RowSearchSkeleton;
