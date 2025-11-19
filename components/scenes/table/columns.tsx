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
import TruncateText from "@/components/ui/truncate-text";
import { stringToColorPallete } from "@/lib/utils/badges";
import { normalizeStringList } from "@/lib/utils/format";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type GenericRow = Record<string, unknown> & { id: string };

export const columns: ColumnDef<GenericRow, unknown>[] = [
  {
    id: "actions",
    enableSorting: false,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="link" size="icon" className="text-current">
            <MoreHorizontal className="size-4 text-current" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>View</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    meta: { width: "50px", label: "Actions" },
  },
  {
    id: "scene_id",
    header: ({ column }) => (
      <button
        className="flex items-center gap-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Scene ID <span className="text-muted-foreground">↕︎</span>
      </button>
    ),
    accessorFn: (row) => (row as any).scene_id ?? "—",
    enableSorting: true,
    cell: ({ getValue }) => (
      <span className="font-extrabold">{String(getValue() ?? "")}</span>
    ),
    meta: { width: "80px", label: "Scene ID" },
  },
  {
    id: "int_ext",
    header: ({ column }) => (
      <button
        className="flex items-center gap-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Int/Ext <span className="text-muted-foreground">↕︎</span>
      </button>
    ),
    accessorFn: (row) => (row as any).int_ext ?? "—",
    enableSorting: true,
    cell: ({ getValue }) => (
      <Badge
        variant="default"
        className={stringToColorPallete(String(getValue() ?? ""))}
      >
        {String(getValue() ?? "")}
      </Badge>
    ),
    meta: { width: "70px", label: "Int/Ext" },
  },
  {
    id: "day_night",
    header: ({ column }) => (
      <button
        className="flex items-center gap-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Day/Night <span className="text-muted-foreground">↕︎</span>
      </button>
    ),
    accessorFn: (row) => (row as any).day_night ?? "—",
    enableSorting: true,
    cell: ({ getValue }) => (
      <Badge
        variant="default"
        className={stringToColorPallete(String(getValue() ?? ""))}
      >
        {String(getValue() ?? "")}
      </Badge>
    ),
    meta: { width: "100px", label: "Day/Night" },
  },
  {
    id: "location",
    header: ({ column }) => (
      <button
        className="flex items-center gap-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Set <span className="text-muted-foreground">↕︎</span>
      </button>
    ),
    accessorFn: (row) => (row as any).location ?? "—",
    enableSorting: true,
    cell: ({ getValue }) => {
      const full = String(getValue() ?? "");
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-help">
              <TruncateText maxChars={20} text={full} />
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" align="center">
            <span className="max-w-xs wrap-break-word">{full || "—"}</span>
          </TooltipContent>
        </Tooltip>
      );
    },
    meta: { width: "180px", label: "Set" },
  },
  {
    id: "scene_title",
    header: ({ column }) => (
      <button
        className="flex items-center gap-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Scene Title <span className="text-muted-foreground">↕︎</span>
      </button>
    ),
    accessorFn: (row) => (row as any).scene_title ?? "—",
    enableSorting: true,
    cell: ({ getValue }) => {
      const full = String(getValue() ?? "");
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-help">
              <TruncateText maxChars={30} text={full} />
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" align="center">
            <span className="max-w-xs wrap-break-word">{full || "—"}</span>
          </TooltipContent>
        </Tooltip>
      );
    },
    meta: { width: "250px", label: "Scene Title" },
  },
  {
    id: "length",
    header: ({ column }) => (
      <button
        className="flex items-center gap-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Page length <span className="text-muted-foreground">↕︎</span>
      </button>
    ),
    accessorFn: (row) => (row as any).length ?? "—",
    enableSorting: true,
    cell: ({ getValue }) => <span>{String(getValue() ?? "")}</span>,
    meta: { width: "110px", label: "Page length" },
  },
  {
    id: "screen_time",
    header: ({ column }) => (
      <button
        className="flex items-center gap-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Screen Time <span className="text-muted-foreground">↕︎</span>
      </button>
    ),
    accessorFn: (row) => (row as any).screen_time ?? "—",
    enableSorting: true,
    cell: ({ getValue }) => <span>{String(getValue() ?? "")}</span>,
    meta: { width: "110px", label: "Screen Time" },
  },
  {
    id: "chars_total",
    header: ({ column }) => (
      <button
        className="flex items-center gap-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Cast ID <span className="text-muted-foreground">↕︎</span>
      </button>
    ),
    accessorFn: (row) => {
      const names = normalizeStringList(row.chars_total, {
        unique: true,
        lowercaseForDedup: true,
      });
      if (!names.length) return "—";
      const formatted = names
        .map((n) => n.toLowerCase().slice(0, 2))
        .join(", ");
      return formatted;
    },
    enableSorting: true,
    cell: ({ getValue, row }) => {
      const full = normalizeStringList(row.original.chars_total, {
        unique: true,
        lowercaseForDedup: true,
      }).join(", ");
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-xs cursor-help">{getValue() as string}</span>
          </TooltipTrigger>
          <TooltipContent side="top" align="center">
            <span className="max-w-xs wrap-break-word">{full || "—"}</span>
          </TooltipContent>
        </Tooltip>
      );
    },
    meta: { width: "200px", label: "Cast ID" },
  },
];
