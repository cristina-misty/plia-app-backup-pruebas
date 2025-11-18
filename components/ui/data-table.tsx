"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
  ColumnFiltersState,
  getFilteredRowModel,
  useReactTable,
  PaginationState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import {
  MultiSelect,
  MultiSelectTrigger,
  MultiSelectValue,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectGroup,
} from "@/components/ui/multi-select";
import StoreSearch from "../general/store-search";
import { useFilteredStore } from "@/store/general/filteredStore";
import {
  matchesTokens,
  normalizeString,
  tokenizeQuery,
} from "@/lib/utils/search";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { getTailwindPaletteClass } from "@/lib/utils/colors";
import { cn } from "@/lib/utils";
import StoreSelect from "../general/store-select";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
  searchable?: boolean;
  searchColumn?: string;
  searchPlaceholder?: string;
  defaultSorting?: SortingState;
  showPagination?: boolean;
  pageSize?: number; // Número de filas por página
  className?: string;
  /**
   * Clave del objeto de fila (ej. "line_color") que contiene un color CSS para pintar cada celda.
   * Si existe y viene en los datos, se aplicará como fondo a todas las celdas de esa fila.
   */
  rowColorKey?: string;
  onRowClick?: (item: TData) => void;
  rowClickable?: boolean;
  selectConfig?: {
    useStore: any;
    selectValue: (s: any) => string | undefined;
    selectSetValue: (s: any) => (v: string) => void;
    selectClear?: (s: any) => () => void;
    options: { value: string; label: string }[];
    placeholder?: string;
    ariaLabel?: string;
    className?: string;
    containerClassName?: string;
  };
  onFilteredDataChange?: (rows: TData[]) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  loading = false,
  searchable = false,
  searchColumn = "name",
  searchPlaceholder = "Buscar...",
  defaultSorting = [],
  showPagination = true,
  pageSize = 5,
  className,
  rowColorKey,
  onRowClick,
  rowClickable = false,
  selectConfig,
  onFilteredDataChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>(defaultSorting);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  // Sincroniza el pageSize cuando cambie el prop
  React.useEffect(() => {
    setPagination((prev) => ({ ...prev, pageSize }));
  }, [pageSize]);

  // Enhance columns with filter functions based on meta.variant
  const enhancedColumns = React.useMemo(() => {
    return (columns as ColumnDef<any, any>[]).map((col) => {
      const meta: any = (col as any).meta || {};
      if (meta?.variant === "multiSelect") {
        return {
          ...col,
          filterFn: (row: any, columnId: string, filterValue: unknown) => {
            const list = Array.isArray(filterValue)
              ? (filterValue as string[])
              : [];
            if (list.length === 0) return true;
            const val = String(row.getValue(columnId) ?? "").toLowerCase();
            const set = new Set(list.map((v) => String(v).toLowerCase()));
            return set.has(val);
          },
        } as ColumnDef<any, any>;
      }
      if (meta?.variant === "text") {
        return {
          ...col,
          filterFn: (row: any, columnId: string, filterValue: unknown) => {
            const q = String(filterValue ?? "").toLowerCase();
            if (!q) return true;
            const val = String(row.getValue(columnId) ?? "").toLowerCase();
            return val.includes(q);
          },
        } as ColumnDef<any, any>;
      }
      return col;
    }) as ColumnDef<TData, TValue>[];
  }, [columns]);

  const table = useReactTable({
    data,
    columns: enhancedColumns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    state: { sorting, columnFilters, pagination },
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Global search across all visible/accessor columns using the shared filter store
  const query = useFilteredStore((s) => s.query);
  const filteredData = React.useMemo(() => {
    if (!searchable) return data;
    const q = normalizeString(query);
    if (!q) return data;

    const tokens = tokenizeQuery(q);
    // Build accessor list from columns (accessorFn or accessorKey)
    const accessors: Array<(row: any) => unknown> = (columns as any[])
      .map((col) => {
        if (typeof col.accessorFn === "function")
          return (row: any) => col.accessorFn(row);
        if (col.accessorKey)
          return (row: any) => (row as any)[col.accessorKey as string];
        return null;
      })
      .filter(Boolean) as Array<(row: any) => unknown>;

    return (data as any[]).filter((row) => {
      const haystack = accessors
        .map((fn) => fn(row))
        .filter((v) => v != null)
        .map(normalizeString)
        // Excluir placeholders vacíos comunes para que no afecten la búsqueda
        .filter((v) => v !== "" && v !== "—" && v !== "-")
        .join(" ");
      return matchesTokens(haystack, tokens, "AND");
    });
  }, [data, columns, searchable, query]);

  // Recreate table when filtered data changes (keeps sorting/pagination state)
  const filteredTable = useReactTable({
    data: filteredData as TData[],
    columns: enhancedColumns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    state: { sorting, columnFilters, pagination },
    getPaginationRowModel: getPaginationRowModel(),
  });

  React.useEffect(() => {
    const rows = filteredTable
      .getRowModel()
      .rows.map((r) => r.original as TData);
    onFilteredDataChange?.(rows);
  }, [filteredData, columnFilters, sorting, pagination]);

  const filterableColumns = React.useMemo(() => {
    return (enhancedColumns as any[]).filter((c) => {
      const id = (c.id as string) || (c.accessorKey as string);
      return Boolean(
        (c as any).meta?.variant && id && filteredTable.getColumn(id)
      );
    });
  }, [enhancedColumns, filteredTable]);

  return (
    <div className={className}>
      {searchable && (
        <div className="flex items-end justify-between gap-2 pb-3">
          {selectConfig && (
            <StoreSelect
              useStore={selectConfig.useStore}
              selectValue={selectConfig.selectValue}
              selectSetValue={selectConfig.selectSetValue}
              selectClear={selectConfig.selectClear}
              options={selectConfig.options}
              placeholder={selectConfig.placeholder ?? "Select"}
              ariaLabel={selectConfig.ariaLabel ?? "Filter"}
              className={selectConfig.className}
              containerClassName={`w-full ${
                selectConfig.containerClassName ?? ""
              }`}
            />
          )}
          <StoreSearch
            useStore={useFilteredStore}
            selectQuery={(s) => s.query}
            selectSetQuery={(s) => s.setQuery}
            selectClear={(s) => s.clear}
            placeholder={searchPlaceholder}
          />
        </div>
      )}

      {filterableColumns.length > 0 && (
        <div className="flex flex-wrap items-end gap-2 pb-3">
          {filterableColumns.map((c) => {
            const id = (c.id as string) || (c.accessorKey as string);
            const column = id ? filteredTable.getColumn(id) : undefined;
            if (!column) return null;
            const meta = (c as any).meta || {};
            if (meta.variant === "multiSelect") {
              const values = (column.getFilterValue() as string[]) ?? [];
              return (
                <div key={column.id} className="">
                  <MultiSelect
                    values={values}
                    onValuesChange={(next) => column.setFilterValue(next)}
                  >
                    <MultiSelectTrigger aria-label={meta.label || column.id}>
                      <MultiSelectValue
                        placeholder={
                          meta.placeholder || meta.label || column.id
                        }
                      />
                    </MultiSelectTrigger>
                    <MultiSelectContent
                      search={{
                        placeholder: "Buscar...",
                        emptyMessage: "Sin resultados.",
                      }}
                    >
                      <MultiSelectGroup>
                        {(meta.options || []).map((opt: any) => (
                          <MultiSelectItem
                            key={opt.value}
                            value={opt.value}
                            badgeLabel={opt.label}
                          >
                            {opt.label}
                          </MultiSelectItem>
                        ))}
                      </MultiSelectGroup>
                    </MultiSelectContent>
                  </MultiSelect>
                </div>
              );
            }
            if (meta.variant === "text") {
              const value = (column.getFilterValue() as string) ?? "";
              return (
                <div key={column.id} className="min-w-[180px]">
                  <Input
                    placeholder={meta.placeholder || meta.label || column.id}
                    aria-label={meta.label || column.id}
                    value={value}
                    onChange={(e) => column.setFilterValue(e.target.value)}
                  />
                </div>
              );
            }
            return null;
          })}
        </div>
      )}

      {/* Contenedor con scroll horizontal en todos los breakpoints cuando haya desbordamiento */}
      <div className="w-full overflow-x-auto rounded-md border">
        {/* La tabla tiene un ancho mínimo para forzar scroll horizontal cuando el viewport es estrecho */}
        <Table className="min-w-[640px] sm:min-w-[768px] table-fixed">
          <TableHeader>
            {filteredTable.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={
                        (header.column.columnDef as any).meta
                          ?.headerClassName ||
                        (header.column.columnDef as any).meta?.className ||
                        undefined
                      }
                      style={{
                        width: (header.column.columnDef as any).meta?.width,
                        minWidth: (header.column.columnDef as any).meta
                          ?.minWidth,
                        maxWidth: (header.column.columnDef as any).meta
                          ?.maxWidth,
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Spinner className="size-5" />
                    <span>Cargando datos...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredTable.getRowModel().rows?.length ? (
              filteredTable.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    rowClickable && "cursor-pointer hover:bg-accent/40"
                  )}
                  onClick={
                    onRowClick
                      ? () => onRowClick(row.original as TData)
                      : undefined
                  }
                  tabIndex={onRowClick ? 0 : -1}
                  onKeyDown={
                    onRowClick
                      ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            onRowClick(row.original as TData);
                          }
                        }
                      : undefined
                  }
                  aria-label={onRowClick ? "Open row detail" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        (cell.column.columnDef as any).meta?.cellClassName ||
                          (cell.column.columnDef as any).meta?.className ||
                          undefined,
                        rowColorKey
                          ? getTailwindPaletteClass(
                              (row.original as any)?.[rowColorKey] as unknown
                            )
                          : undefined
                      )}
                      style={{
                        width: (cell.column.columnDef as any).meta?.width,
                        minWidth: (cell.column.columnDef as any).meta?.minWidth,
                        maxWidth: (cell.column.columnDef as any).meta?.maxWidth,
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {showPagination && (
        <div className="py-4">
          <DataTablePagination
            table={filteredTable}
            loading={loading}
            showPageSize={true}
          />
        </div>
      )}
    </div>
  );
}
