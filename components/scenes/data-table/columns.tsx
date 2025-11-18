"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { DollarSign } from "lucide-react";

export type GenericRow = Record<string, unknown> & { id: string };

export const columns: ColumnDef<GenericRow, unknown>[] = [
  {
    id: "actions",
    enableSorting: false,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>View</DropdownMenuItem>
          <DropdownMenuItem>Edit</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    meta: { width: "70px" },
  },
  {
    id: "title",
    header: ({ column }) => (
      <button
        className="flex items-center gap-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Title <span className="text-muted-foreground">↕︎</span>
      </button>
    ),
    accessorFn: (row) => (row as any).title ?? "—",
    enableSorting: true,
    cell: ({ getValue }) => (
      <span className="font-extrabold">{String(getValue() ?? "")}</span>
    ),
    meta: { minWidth: "120px" },
  },
  {
    id: "status",
    header: "Status",
    accessorFn: (row) => (row as any).status ?? "—",
    cell: ({ getValue }) => (
      <Badge variant="outline" className="capitalize">
        {String(getValue() ?? "")}
      </Badge>
    ),
    meta: { minWidth: "100px" },
  },
  {
    id: "budget",
    header: ({ column }) => (
      <button
        className="flex items-center gap-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Budget <span className="text-muted-foreground">↕︎</span>
      </button>
    ),
    accessorFn: (row) => (row as any).budget ?? "—",
    enableSorting: true,
    cell: ({ getValue }) => (
      <div className="flex items-center gap-1">
        <DollarSign className="size-4" />
        {String(getValue() ?? "")}
      </div>
    ),
    meta: { minWidth: "110px" },
  },
];
