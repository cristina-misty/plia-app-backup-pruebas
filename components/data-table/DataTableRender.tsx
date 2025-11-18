"use client";

import * as React from "react";
import { DiceDataTable } from "./DataTable";
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
};

export default function DataTableRender({
  data,
  columns,
  availableStatuses,
  searchEnabled = true,
  statusEnabled = true,
  getSearchHaystack,
  statusKey = "status",
  pageSizeOptions = [10, 20, 50],
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
    <DiceDataTable
      data={rows as any[]}
      columns={cols}
      availableStatuses={availableStatuses ?? []}
      searchEnabled={searchEnabled}
      statusEnabled={statusEnabled}
      getSearchHaystack={haystackGetter}
      statusKey={statusKey}
      pageSizeOptions={pageSizeOptions}
    />
  );
}
