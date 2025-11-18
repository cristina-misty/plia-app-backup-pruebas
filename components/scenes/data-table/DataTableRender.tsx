"use client";

import * as React from "react";
import { DiceDataTable } from "./DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  DollarSign,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Project = {
  id: string;
  title: string;
  status: "active" | "inactive";
  budget: number;
};

export default function DataTableRender() {
  const rows = React.useMemo<Project[]>(
    () => [
      { id: "1", title: "Project Alpha", status: "active", budget: 50000 },
      { id: "2", title: "Project Beta", status: "inactive", budget: 75000 },
      { id: "3", title: "Project Gamma", status: "active", budget: 25000 },
      { id: "4", title: "Project Delta", status: "active", budget: 100000 },
    ],
    []
  );

  const columns = React.useMemo<ColumnDef<Project, unknown>[]>(
    () => [
      {
        id: "title",
        accessorKey: "title",
        header: "Title",
        cell: ({ cell }) => <div>{String(cell.getValue())}</div>,
        enableColumnFilter: true,
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        cell: ({ cell }) => {
          const status = cell.getValue<Project["status"]>();
          const Icon = status === "active" ? CheckCircle2 : XCircle;
          return (
            <Badge variant="outline" className="capitalize">
              <Icon className="mr-1 h-4 w-4" />
              {status}
            </Badge>
          );
        },
        enableColumnFilter: true,
      },
      {
        id: "budget",
        accessorKey: "budget",
        header: "Budget",
        cell: ({ cell }) => {
          const budget = cell.getValue<Project["budget"]>();
          return (
            <div className="flex items-center gap-1">
              <DollarSign className="size-4" />
              {Number(budget).toLocaleString()}
            </div>
          );
        },
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
    ],
    []
  );

  return (
    <div className="p-8 space-y-6">
      <DiceDataTable
        data={rows}
        columns={columns}
        availableStatuses={[
          { label: "Active", value: "active" },
          { label: "Inactive", value: "inactive" },
        ]}
      />
    </div>
  );
}
