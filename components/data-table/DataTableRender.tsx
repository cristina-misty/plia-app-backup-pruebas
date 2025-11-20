"use client";

import * as React from "react";
import { DiceDataTable as DiceDataTableComponent } from "./DataTable";
import type { ColumnDef } from "@tanstack/react-table";

type DataTableRenderProps = {
  data?: unknown[] | null;
  columns?: ColumnDef<any, unknown>[];
  availableStatuses?: { label: string; value: string }[];
  searchEnabled?: boolean;
  statusEnabled?: boolean;
  getSearchHaystack?: (row: any) => string | Array<unknown>;
  statusKey?: string;
  pageSizeOptions?: number[];
  filterKeys?: { id: string; label: string; classNameTrigger?: string }[];
  className?: string;
  onRowClick?: (row: any) => void;
  onFilteredDataChange?: (rows: any[]) => void;
};

export default function DataTableRender({
  data,
  columns,
  availableStatuses,
  searchEnabled = true,
  statusEnabled = true,
  getSearchHaystack,
  statusKey = "status",
  pageSizeOptions = [10, 25, 50, 100, 500],
  filterKeys,
  className,
  onRowClick,
  onFilteredDataChange,
}: DataTableRenderProps) {
  const rows = React.useMemo(() => (Array.isArray(data) ? data : []), [data]);
  const cols = React.useMemo<ColumnDef<any, unknown>[]>(() => {
    if (columns && columns.length > 0) return columns;
    return [];
  }, [columns]);
  const haystackGetter = React.useCallback(
    (r: any) => {
      if (getSearchHaystack) return getSearchHaystack(r);
      return (r?.title ?? r?.header ?? "").toString();
    },
    [getSearchHaystack]
  );

  return (
    <div className={className}>
      {(DiceDataTableComponent as any)({
        data: rows as any[],
        columns: cols,
        availableStatuses: availableStatuses ?? [],
        searchEnabled,
        statusEnabled,
        getSearchHaystack: haystackGetter,
        statusKey,
        pageSizeOptions,
        filterKeys,
        onRowClick,
        onFilteredDataChange,
      })}
    </div>
  );
}
