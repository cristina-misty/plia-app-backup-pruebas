import React from "react";
import SmallCardSkeleton from "./small-card-skeleton";
import { useIsMobile } from "@/hooks/general/use-mobile";

const headerSkeleton = () => {
  const times = 4;
  const timesMobile = 2;
  const isMobile = useIsMobile();

  return (
    <div className="flex items-center justify-start flex-wrap gap-2">
      {Array.from({ length: isMobile ? timesMobile : times }).map(
        (_, index) => (
          <SmallCardSkeleton key={index} />
        )
      )}
    </div>
  );
};

export default headerSkeleton;
