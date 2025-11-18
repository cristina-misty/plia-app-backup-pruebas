"use client";

import * as React from "react";
import type { Table } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  loading?: boolean;
  className?: string;
  showPageSize?: boolean;
  pageSizeOptions?: number[];
  neighbors?: number; // how many pages to show around current
  showPageInfo?: boolean;
}

export function DataTablePagination<TData>({
  table,
  loading = false,
  className,
  showPageSize = false,
  pageSizeOptions = [5, 25, 50, 100, 500],
  neighbors = 1,
  showPageInfo = true,
}: DataTablePaginationProps<TData>) {
  const pageCount = table.getPageCount();
  const current = table.getState().pagination.pageIndex + 1; // 1-based index

  // Build numbered pages with ellipsis
  const range = React.useMemo<(number | "ellipsis")[]>(() => {
    const result: (number | "ellipsis")[] = [];
    const add = (x: number | "ellipsis") => result.push(x);
    if (pageCount <= 0) return result;
    const showLeftEllipsis = current - neighbors > 2;
    const showRightEllipsis = current + neighbors < pageCount - 1;
    add(1);
    for (
      let i = Math.max(2, current - neighbors);
      i <= Math.min(pageCount - 1, current + neighbors);
      i++
    ) {
      if (i === 2 && showLeftEllipsis) add("ellipsis");
      add(i);
    }
    if (showRightEllipsis) add("ellipsis");
    if (pageCount > 1) add(pageCount);
    return result;
  }, [current, neighbors, pageCount]);

  return (
    <div
      className={cn("flex w-full items-center justify-start gap-8", className)}
    >
      <div className="flex w-full items-center gap-4 lg:w-fit">
        {showPageInfo && (
          <div className="flex w-full items-center justify-center text-sm font-medium">
            Page {current} of {pageCount}
          </div>
        )}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => table.previousPage()}
                disabled={loading || !table.getCanPreviousPage()}
              />
            </PaginationItem>
            {range.map((item, idx) => (
              <PaginationItem key={`${item}-${idx}`}>
                {item === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    isActive={item === current}
                    onClick={() => table.setPageIndex(item - 1)}
                  >
                    {item}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => table.nextPage()}
                disabled={loading || !table.getCanNextPage()}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <div
        className={cn(
          "hidden items-center gap-2 lg:flex",
          showPageSize ? "" : "hidden"
        )}
      >
        <Label htmlFor="rows-per-page" className="text-sm font-medium">
          Rows per page
        </Label>
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => table.setPageSize(Number(value))}
        >
          <SelectTrigger size="sm" className="w-20" id="rows-per-page">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={`${size}`}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
