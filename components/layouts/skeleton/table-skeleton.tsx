import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const TableSkeleton = () => {
  const filterTimes = 4;
  return (
    <>
      {/* filtros / lista skeleton */}
      <div className="w-full flex items-center justify-start gap-2">
        {Array.from({ length: filterTimes }).map((_, index) => (
          <Card className="h-6 w-[100px]" key={index}>
            <div className="h-full w-full flex items-center justify-center">
              <Skeleton className="h-6 w-full mx-4" />
            </div>
          </Card>
        ))}
      </div>
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
