"use client";

import * as React from "react";
import DataTableRender from "@/components/data-table/DataTableRender";
import { columns as sceneColumns } from "@/components/scenes/table/columns";
import { useScenes } from "@/hooks/api/useScenes";

export default function ScenesClient() {
  const { scenes } = useScenes({ autoFetch: true });

  return (
    <DataTableRender
      data={scenes ?? []}
      columns={sceneColumns}
      availableStatuses={[]}
      statusEnabled={false}
      filterKeys={[
        {
          id: "episode_order",
          label: "Episode",
          classNameTrigger: "max-w-[150px]",
        },
        { id: "int_ext", label: "I/E", classNameTrigger: "max-w-[150px]" },
        { id: "day_night", label: "D/N", classNameTrigger: "max-w-[150px]" },
        {
          id: "length",
          label: "Page length",
          classNameTrigger: "max-w-[200px]",
        },
      ]}
      getSearchHaystack={(r: any) => [
        r.scene_id,
        r.scene_title,
        r.location,
        r.int_ext,
        r.day_night,
        r.length,
        r.chars_total,
      ]}
      pageSizeOptions={[10, 25, 50, 100, 500]}
    />
  );
}
