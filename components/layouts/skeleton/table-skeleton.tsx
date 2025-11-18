import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const TableSkeleton = () => {
  return (
    <>
      {/* Tabla / lista skeleton */}
      <div className="overflow-hidden rounded-md border">
        <div className="p-3">
          {/* Barra de búsqueda */}
          <Skeleton className="h-10 w-64" />
        </div>
        <div className="border-t divide-y">
          {/* Filas skeleton (coincide con pageSize por defecto o el deseado) */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="grid grid-cols-4 gap-4 p-3">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          ))}
        </div>
        {/* Paginación skeleton */}
        <div className="flex items-center justify-end space-x-2 py-4 px-3">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </>
  );
};

export default TableSkeleton;
