"use client";

import * as React from "react";
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  RowSelectionState,
  PaginationState,
  OnChangeFn,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "./DataTableColumnHeader";

import { createStore } from "zustand/vanilla";
import { useStore } from "zustand";
import { normalizeString } from "@/lib/utils/search";
import { DataTableToolbar } from "./DataTableToolbar";

type DiceTableState = {
  title: string;
  status: string[];
  rowSelection: RowSelectionState;
  columnVisibility: VisibilityState;
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  pagination: PaginationState;
  setTitle: (v: string) => void;
  toggleStatus: (v: string) => void;
  clearStatuses: () => void;
  setRowSelection: OnChangeFn<RowSelectionState>;
  setColumnVisibility: OnChangeFn<VisibilityState>;
  setSorting: OnChangeFn<SortingState>;
  setColumnFilters: OnChangeFn<ColumnFiltersState>;
  setPagination: OnChangeFn<PaginationState>;
};

export function DiceDataTable<TData extends { id: string }>({
  data,
  columns,
  availableStatuses = [],
  searchEnabled = true,
  statusEnabled = true,
  getSearchHaystack,
  statusKey = "status",
  pageSizeOptions,
}: {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  availableStatuses?: {
    label: string;
    value: string;
    icon?: React.ComponentType;
  }[];
  searchEnabled?: boolean;
  statusEnabled?: boolean;
  getSearchHaystack?: (item: TData) => string | Array<unknown>;
  statusKey?: keyof TData | string;
  pageSizeOptions?: number[];
}) {
  const storeRef = React.useRef(
    createStore<DiceTableState>(() => ({
      title: "",
      status: [],
      rowSelection: {},
      columnVisibility: {},
      sorting: [],
      columnFilters: [],
      pagination: { pageIndex: 0, pageSize: 10 },
      setTitle: (v) =>
        storeRef.current.setState({
          title: v,
          pagination: {
            ...storeRef.current.getState().pagination,
            pageIndex: 0,
          },
        }),
      toggleStatus: (v) => {
        const s = storeRef.current.getState().status;
        const next = s.includes(v) ? s.filter((x) => x !== v) : [...s, v];
        storeRef.current.setState({
          status: next,
          pagination: {
            ...storeRef.current.getState().pagination,
            pageIndex: 0,
          },
        });
      },
      clearStatuses: () => {
        storeRef.current.setState({
          status: [],
          pagination: {
            ...storeRef.current.getState().pagination,
            pageIndex: 0,
          },
        });
      },
      setRowSelection: (updaterOrValue) => {
        const prev = storeRef.current.getState().rowSelection;
        const next =
          typeof updaterOrValue === "function"
            ? (updaterOrValue as (old: RowSelectionState) => RowSelectionState)(
                prev
              )
            : (updaterOrValue as RowSelectionState);
        storeRef.current.setState({ rowSelection: next });
      },
      setColumnVisibility: (updaterOrValue) => {
        const prev = storeRef.current.getState().columnVisibility;
        const next =
          typeof updaterOrValue === "function"
            ? (updaterOrValue as (old: VisibilityState) => VisibilityState)(
                prev
              )
            : (updaterOrValue as VisibilityState);
        storeRef.current.setState({ columnVisibility: next });
      },
      setSorting: (updaterOrValue) => {
        const prev = storeRef.current.getState().sorting;
        const next =
          typeof updaterOrValue === "function"
            ? (updaterOrValue as (old: SortingState) => SortingState)(prev)
            : (updaterOrValue as SortingState);
        storeRef.current.setState({ sorting: next });
      },
      setColumnFilters: (updaterOrValue) => {
        const prev = storeRef.current.getState().columnFilters;
        const next =
          typeof updaterOrValue === "function"
            ? (
                updaterOrValue as (
                  old: ColumnFiltersState
                ) => ColumnFiltersState
              )(prev)
            : (updaterOrValue as ColumnFiltersState);
        storeRef.current.setState({ columnFilters: next });
      },
      setPagination: (updaterOrValue) => {
        const prev = storeRef.current.getState().pagination;
        const next =
          typeof updaterOrValue === "function"
            ? (updaterOrValue as (old: PaginationState) => PaginationState)(
                prev
              )
            : (updaterOrValue as PaginationState);
        storeRef.current.setState({ pagination: next });
      },
    }))
  );

  const title = useStore(storeRef.current, (s) => s.title);
  const status = useStore(storeRef.current, (s) => s.status);
  const rowSelection = useStore(storeRef.current, (s) => s.rowSelection);
  const columnVisibility = useStore(
    storeRef.current,
    (s) => s.columnVisibility
  );
  const sorting = useStore(storeRef.current, (s) => s.sorting);
  const columnFilters = useStore(storeRef.current, (s) => s.columnFilters);
  const pagination = useStore(storeRef.current, (s) => s.pagination);

  const setTitle = useStore(storeRef.current, (s) => s.setTitle);
  const toggleStatus = useStore(storeRef.current, (s) => s.toggleStatus);
  const clearStatuses = useStore(storeRef.current, (s) => s.clearStatuses);
  const setRowSelection = useStore(storeRef.current, (s) => s.setRowSelection);
  const setColumnVisibility = useStore(
    storeRef.current,
    (s) => s.setColumnVisibility
  );
  const setSorting = useStore(storeRef.current, (s) => s.setSorting);
  const setColumnFilters = useStore(
    storeRef.current,
    (s) => s.setColumnFilters
  );
  const setPagination = useStore(storeRef.current, (s) => s.setPagination);

  const filtered = React.useMemo(() => {
    const t = normalizeString(title);
    return data.filter((item) => {
      const hay = getSearchHaystack
        ? getSearchHaystack(item)
        : (item as any).title ?? (item as any).header ?? "";
      const haystack = Array.isArray(hay)
        ? hay
            .filter(Boolean)
            .map((x) => normalizeString(String(x)))
            .join(" ")
        : normalizeString(String(hay));
      const matchesTitle = !searchEnabled || !t || haystack.includes(t);
      const itemStatus = (item as any)[statusKey as any];
      const matchesStatus =
        !statusEnabled || status.length === 0 || status.includes(itemStatus);
      return matchesTitle && matchesStatus;
    });
  }, [
    data,
    title,
    status,
    getSearchHaystack,
    searchEnabled,
    statusEnabled,
    statusKey,
  ]);

  const table = useReactTable({
    data: filtered,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => (row as any).id,
    enableRowSelection: false,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <DataTableToolbar
          title={title}
          status={status}
          onTitleChange={setTitle}
          onToggleStatus={toggleStatus}
          availableStatuses={availableStatuses}
          onClearStatuses={clearStatuses}
          showStatus={statusEnabled}
        />
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter((c) => c.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={() =>
                      column.toggleVisibility(!column.getIsVisible())
                    }
                    className="capitalize"
                  >
                    {((column.columnDef as any)?.meta?.label as string) ||
                      column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="w-full overflow-hidden rounded-lg border">
        <Table className="table-fixed w-full">
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      width: (header.column.columnDef as any).meta?.width,
                      minWidth: (header.column.columnDef as any).meta?.minWidth,
                    }}
                  >
                    {header.isPlaceholder ? null : typeof header.column
                        .columnDef.header === "string" ? (
                      <DataTableColumnHeader
                        column={header.column}
                        label={header.column.columnDef.header as string}
                      />
                    ) : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        width: (cell.column.columnDef as any).meta?.width,
                        minWidth: (cell.column.columnDef as any).meta?.minWidth,
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination
        table={table}
        showPageSize
        showSelectionInfo={false}
        pageSizeOptions={pageSizeOptions ?? [10, 25, 50, 100, 500]}
      />
    </div>
  );
}
