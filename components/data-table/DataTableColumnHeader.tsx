"use client";

import * as React from "react";
import { ArrowUpDown } from "lucide-react";
import type { Column } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

export function DataTableColumnHeader<TData>({
  column,
  label,
}: {
  column: Column<TData, unknown>;
  label: string;
}) {
  const isSorted = column.getIsSorted();
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => column.toggleSorting(isSorted === "asc")}
      className="flex items-center gap-2"
    >
      {label}
      <ArrowUpDown className="size-4" />
    </Button>
  );
}
