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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "./DataTableColumnHeader";

import { createStore } from "zustand/vanilla";
import { useStore } from "zustand";
import { normalizeString, buildHaystack } from "@/lib/utils/search";
import { DataTableToolbar } from "./DataTableToolbar";
import { getTailwindPaletteClass } from "@/lib/utils/colors";
import { IconX } from "@tabler/icons-react";

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
  rowColorKey?: string;
  filtersState: Record<string, string[]>;
  toggleFilterValue: (id: string, value: string) => void;
  clearFilterValues: (id: string) => void;
  clearAllFilters: () => void;
};

export function DiceDataTable<TData extends Record<string, any>>({
  data,
  columns,
  availableStatuses = [],
  searchEnabled = true,
  statusEnabled = true,
  getSearchHaystack,
  statusKey = "status",
  pageSizeOptions,
  filterKeys,
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
  filterKeys?: {
    id: keyof TData | string;
    label: string;
    classNameTrigger?: string;
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
      pagination: { pageIndex: 0, pageSize: 500 },
      filtersState: {},
      clearAllFilters: () => {
        storeRef.current.setState({
          status: [],
          filtersState: {},
          pagination: {
            ...storeRef.current.getState().pagination,
            pageIndex: 0,
          },
        });
      },
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
      toggleFilterValue: (id, value) => {
        const prev = storeRef.current.getState().filtersState[id] ?? [];
        const next = prev.includes(value)
          ? prev.filter((x) => x !== value)
          : [...prev, value];
        storeRef.current.setState({
          filtersState: {
            ...storeRef.current.getState().filtersState,
            [id]: next,
          },
          pagination: {
            ...storeRef.current.getState().pagination,
            pageIndex: 0,
          },
        });
      },
      clearFilterValues: (id) => {
        const next = { ...storeRef.current.getState().filtersState };
        delete next[id];
        storeRef.current.setState({
          filtersState: next,
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
  const deferredTitle = React.useDeferredValue(title);
  const status = useStore(storeRef.current, (s) => s.status);
  const rowSelection = useStore(storeRef.current, (s) => s.rowSelection);
  const columnVisibility = useStore(
    storeRef.current,
    (s) => s.columnVisibility
  );
  const sorting = useStore(storeRef.current, (s) => s.sorting);
  const columnFilters = useStore(storeRef.current, (s) => s.columnFilters);
  const pagination = useStore(storeRef.current, (s) => s.pagination);
  const filtersState = useStore(storeRef.current, (s) => s.filtersState);
  const toggleFilterValue = useStore(
    storeRef.current,
    (s) => s.toggleFilterValue
  );
  const clearFilterValues = useStore(
    storeRef.current,
    (s) => s.clearFilterValues
  );
  const clearAllFilters = useStore(storeRef.current, (s) => s.clearAllFilters);

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

  const haystacks = React.useMemo(() => {
    if (!searchEnabled) return [] as string[];
    return data.map((item) => {
      const hay = getSearchHaystack
        ? getSearchHaystack(item)
        : (item as any).title ?? (item as any).header ?? "";
      const haystack = Array.isArray(hay)
        ? buildHaystack(hay)
        : normalizeString(hay);
      return haystack;
    });
  }, [data, getSearchHaystack, searchEnabled]);

  const filterOptionsMap = React.useMemo(() => {
    const map = new Map<string, { label: string; value: string }[]>();
    for (const fk of filterKeys ?? []) {
      const set = new Set<string>();
      for (const item of data) {
        const v = (item as any)[fk.id as any];
        if (!v) continue;
        set.add(String(v));
      }
      const options = Array.from(set)
        .sort((a, b) => a.localeCompare(b))
        .map((v) => ({ label: v, value: v }));
      map.set(String(fk.id), options);
    }
    return map;
  }, [data, filterKeys]);

  const filterCacheRef = React.useRef<Map<string, TData[]>>(new Map());
  const lastDataRef = React.useRef<TData[] | null>(null);
  if (lastDataRef.current !== data) {
    filterCacheRef.current.clear();
    lastDataRef.current = data;
  }

  const filteredWithPerf = React.useMemo(() => {
    const t = normalizeString(deferredTitle);
    const cacheKey = JSON.stringify({ t, status, filtersState });
    const cached = filterCacheRef.current.get(cacheKey);
    if (cached) {
      return { rows: cached, tookMs: 0 } as { rows: TData[]; tookMs: number };
    }
    const t0 = performance.now();
    const rows = data.filter((item, i) => {
      const haystack = haystacks[i] ?? "";
      const matchesTitle = !searchEnabled || !t || haystack.includes(t);
      const itemStatus = (item as any)[statusKey as any];
      const matchesStatus =
        !statusEnabled || status.length === 0 || status.includes(itemStatus);
      const matchesFilters = (filterKeys ?? []).every((fk) => {
        const selected = filtersState[String(fk.id)] ?? [];
        if (!selected || selected.length === 0) return true;
        const v = (item as any)[fk.id as any];
        const nv = normalizeString(v);
        const set = new Set(selected.map((s) => normalizeString(s)));
        return set.has(nv);
      });
      return matchesTitle && matchesStatus && matchesFilters;
    });
    const tookMs = performance.now() - t0;
    filterCacheRef.current.set(cacheKey, rows);
    return { rows, tookMs } as { rows: TData[]; tookMs: number };
  }, [
    data,
    deferredTitle,
    status,
    getSearchHaystack,
    searchEnabled,
    statusEnabled,
    statusKey,
    filtersState,
    filterKeys,
    haystacks,
  ]);

  const [isFilteringSlow, setIsFilteringSlow] = React.useState(false);
  React.useEffect(() => {
    setIsFilteringSlow(filteredWithPerf.tookMs > 100);
  }, [filteredWithPerf.tookMs]);

  const table = useReactTable({
    data: filteredWithPerf.rows,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row, index) =>
      String(
        (row as any)?.id ??
          (row as any)?.scene_uuid ??
          (row as any)?.episode_uuid ??
          index
      ),
    enableRowSelection: false,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const rowsModel = table.getRowModel().rows;
  const shouldVirtualize = rowsModel.length > 300;
  const ROW_HEIGHT = 44;
  const overscan = 5;
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = React.useState(0);
  const [viewportHeight, setViewportHeight] = React.useState(0);
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setScrollTop(el.scrollTop);
    onScroll();
    el.addEventListener("scroll", onScroll);
    const ro = new ResizeObserver(() => setViewportHeight(el.clientHeight));
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, []);

  const startIndexBase = Math.floor(scrollTop / ROW_HEIGHT);
  const endIndexBase = Math.floor((scrollTop + viewportHeight) / ROW_HEIGHT);
  const startIndex = Math.max(0, startIndexBase - overscan);
  const endIndex = Math.min(rowsModel.length - 1, endIndexBase + overscan);
  const visibleRows = shouldVirtualize
    ? rowsModel.slice(startIndex, endIndex + 1)
    : rowsModel;
  const topPad = shouldVirtualize ? startIndex * ROW_HEIGHT : 0;
  const bottomPad = shouldVirtualize
    ? Math.max(
        0,
        rowsModel.length * ROW_HEIGHT - topPad - visibleRows.length * ROW_HEIGHT
      )
    : 0;

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center justify-between gap-2 overflow-auto">
        <DataTableToolbar
          title={title}
          status={status}
          onTitleChange={setTitle}
          onToggleStatus={toggleStatus}
          availableStatuses={availableStatuses}
          onClearStatuses={clearStatuses}
          showStatus={statusEnabled}
          searchEnabled={false}
          filters={(filterKeys ?? []).map((fk) => {
            const options = filterOptionsMap.get(String(fk.id)) ?? [];
            const selected = filtersState[String(fk.id)] ?? [];
            return {
              id: String(fk.id),
              label: fk.label,
              options,
              selected,
              onToggle: (v: string) => toggleFilterValue(String(fk.id), v),
              onClear: () => clearFilterValues(String(fk.id)),
              classNameTrigger: fk.classNameTrigger,
            };
          })}
          loading={false}
          actions={(() => {
            const hasAnyFilter =
              status.length > 0 ||
              Object.values(filtersState).some((arr) => (arr?.length ?? 0) > 0);
            if (!hasAnyFilter) return null;
            return (
              <Button
                variant="outline"
                size="icon"
                onClick={() => clearAllFilters()}
              >
                <IconX />
              </Button>
            );
          })()}
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
      <div
        ref={scrollRef}
        className="w-full overflow-auto rounded-lg border max-h-[70vh]"
      >
        <Table className="table-fixed w-full">
          <TableHeader className="bg-background">
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
            {rowsModel?.length ? (
              <>
                {shouldVirtualize && topPad > 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      style={{ height: topPad }}
                    />
                  </TableRow>
                )}
                {visibleRows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={getTailwindPaletteClass(
                      (row.original as any)?.line_color
                    )}
                    style={
                      getTailwindPaletteClass((row.original as any)?.line_color)
                        ? undefined
                        : (row.original as any)?.line_color
                        ? {
                            backgroundColor: String(
                              (row.original as any)?.line_color
                            ),
                          }
                        : undefined
                    }
                    title={
                      (row.original as any)?.line_color
                        ? String((row.original as any)?.line_color)
                        : undefined
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={{
                          width: (cell.column.columnDef as any).meta?.width,
                          minWidth: (cell.column.columnDef as any).meta
                            ?.minWidth,
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                {shouldVirtualize && bottomPad > 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      style={{ height: bottomPad }}
                    />
                  </TableRow>
                )}
              </>
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
