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
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { DataTableToolbar } from "./DataTableToolbar";
import { createStore } from "zustand/vanilla";
import { useStore } from "zustand";
import { normalizeString } from "@/lib/utils/search";

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
}: {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  availableStatuses?: {
    label: string;
    value: string;
    icon?: React.ComponentType;
  }[];
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
      const matchesTitle =
        !t ||
        normalizeString(
          (item as any).title ?? (item as any).header ?? ""
        ).includes(t);
      const matchesStatus =
        status.length === 0 || status.includes((item as any).status);
      return matchesTitle && matchesStatus;
    });
  }, [data, title, status]);

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
                .filter(
                  (c) => typeof c.accessorFn !== "undefined" && c.getCanHide()
                )
                .map((column) => (
                  <DropdownMenuItem
                    key={column.id}
                    className="capitalize"
                    onClick={() =>
                      column.toggleVisibility(!column.getIsVisible())
                    }
                  >
                    {column.id}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
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
                    <TableCell key={cell.id}>
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
      <DataTablePagination table={table} showPageSize showSelectionInfo={false} />
    </div>
  );
}

export const defaultColumns = <
  TData extends { id: string; title?: string; status?: string }
>() =>
  [
    {
      id: "title",
      accessorKey: "title",
      header: "Title",
      cell: ({ cell }: any) => <div>{String(cell.getValue())}</div>,
      meta: { label: "Title" },
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      cell: ({ cell }: any) => (
        <Badge variant="outline" className="capitalize">
          {String(cell.getValue())}
        </Badge>
      ),
      meta: { label: "Status" },
    },
    {
      id: "actions",
      cell: function Cell() {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Make a copy</DropdownMenuItem>
              <DropdownMenuItem>Favorite</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ] as ColumnDef<TData, unknown>[];
