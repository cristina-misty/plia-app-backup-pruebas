"use client";

import * as React from "react";
import DataTableRender from "@/components/data-table/DataTableRender";
import { columns as sceneColumns } from "@/components/scenes/table/columns";
import { useScenes } from "@/hooks/api/useScenes";
import SearchRow from "@/components/general/search-row";
import { useSearchFilters } from "@/hooks/general/useSearchFilters";
import { useToggleView3 } from "@/components/general/toggle-view";

export default function ScenesClient() {
  const { mode, setMode, viewTable, viewCards, viewCharts } =
    useToggleView3("table");
  const { scenes } = useScenes({ autoFetch: true });
  const { query, setQuery, clearQuery, filtered } = useSearchFilters(scenes, {
    getHaystack: (r: any) => [
      r.scene_id,
      r.scene_title,
      r.location,
      r.int_ext,
      r.day_night,
      r.length,
      r.chars_total,
    ],
    filterKey: "day_night",
  });

  return (
    <>
      <SearchRow
        searchConfig={{
          query,
          setQuery,
          clear: clearQuery,
          placeholder: "Search",
          ariaLabel: "Search scenes",
          containerClassName: "w-full",
        }}
        viewMode={mode}
        onChangeViewMode={setMode}
        /* chartsEnabled={Boolean(chartComponent)} */
      />
      <DataTableRender
        className={viewTable}
        data={filtered}
        columns={sceneColumns}
        availableStatuses={[]}
        statusEnabled={false}
        searchEnabled={false}
        filterKeys={[
          {
            id: "episode_order",
            label: "Episode",
            classNameTrigger: "max-w-[150px]",
          },
          { id: "int_ext", label: "I/E", classNameTrigger: "max-w-[150px]" },
          {
            id: "length",
            label: "Page length",
            classNameTrigger: "max-w-[200px]",
          },
        ]}
        getSearchHaystack={(r: any) => r.scene_title}
        pageSizeOptions={[10, 25, 50, 100, 500]}
      />
    </>
  );
}
