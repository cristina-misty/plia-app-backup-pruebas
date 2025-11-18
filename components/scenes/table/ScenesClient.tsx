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
