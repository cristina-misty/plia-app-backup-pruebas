"use client";

import * as React from "react";
import { DiceDataTable } from "./DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { columns as baseColumns } from "./columns";

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
    () => baseColumns as ColumnDef<Project, unknown>[],
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
        getSearchHaystack={(r) => [r.title, r.status, String(r.budget)]}
        statusKey="status"
        pageSizeOptions={[10, 20, 50]}
      />
    </div>
  );
}
