"use client";

import * as React from "react";
import DataTableRender from "@/components/data-table/DataTableRender";
import { columns as sceneColumns } from "@/components/scenes/table/columns";
import { useScenes } from "@/hooks/api/useScenes";
import SearchRow from "@/components/general/search-row";
import { useSearchFilters } from "@/hooks/general/useSearchFilters";
import { useToggleView3 } from "@/components/general/toggle-view";
import { useSeries } from "@/hooks/api/useSeries";
import TableSkeleton from "@/components/layouts/skeleton/table-skeleton";
import {
  IconChairDirector,
  IconClock,
  IconNotes,
  IconUsersGroup,
} from "@tabler/icons-react";
import { Empty } from "@/components/ui/empty";
import HeaderSkeleton from "@/components/layouts/skeleton/header-skeleton";
import RowSearchSkeleton from "@/components/layouts/skeleton/row-search-skeleton";
import { useSelectedSceneStore } from "@/store/scenes/selectedScene";
import { useRouter } from "next/navigation";
import { useBreadcrumbStore } from "@/store/general/breadcrumb";
import SmallCards from "@/components/general/small-cards";
import { sumScreenTime, formatHMS } from "@/lib/utils/format";
import { EyeIcon, icons } from "lucide-react";

export default function ScenesClient() {
  const { mode, setMode, viewTable, viewCards, viewCharts } =
    useToggleView3("table");
  const { series, loading, error: seriesError } = useSeries();
  const {
    scenes,
    loading: scenesLoading,
    error: scenesError,
  } = useScenes({ autoFetch: true });
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

  const router = useRouter();
  const setSelected = useSelectedSceneStore((s) => s.setSelected);
  const setDetailLabel = useBreadcrumbStore((s) => s.setDetailLabel);
  const [visibleRows, setVisibleRows] = React.useState<any[]>(
    () => filtered ?? []
  );
  const computeId = React.useCallback(
    (row: any, index: number) =>
      String(row?.id ?? row?.scene_uuid ?? row?.episode_uuid ?? index),
    []
  );
  const filteredIdsKey = React.useMemo(() => {
    const list = Array.isArray(filtered) ? filtered : [];
    return list.map(computeId).join("|");
  }, [filtered, computeId]);
  const visibleIdsKey = React.useMemo(() => {
    return visibleRows.map(computeId).join("|");
  }, [visibleRows, computeId]);
  React.useEffect(() => {
    if (filteredIdsKey !== visibleIdsKey) {
      setVisibleRows(Array.isArray(filtered) ? filtered : []);
    }
  }, [filteredIdsKey, visibleIdsKey, filtered]);

  if (scenesLoading || loading)
    return (
      <div className="space-y-4">
        <RowSearchSkeleton />
        <HeaderSkeleton />
        <TableSkeleton />
      </div>
    );

  if (seriesError || !series?.length)
    return (
      <Empty
        title={seriesError ? "Error al cargar las series" : "Sin series"}
        description={
          seriesError
            ? `No se pudieron obtener las series: ${seriesError}`
            : "No hay series disponibles para este perfil."
        }
        icon={<IconUsersGroup className="h-10 w-10 text-muted-foreground" />}
        className="my-8"
      />
    );

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
      {(() => {
        const total = visibleRows.length;
        const totalSeconds = sumScreenTime(visibleRows);
        const timeText = formatHMS(totalSeconds);
        const items = [
          {
            label: "Scenes",
            value: total,
            icon: <IconChairDirector className="size-8" />,
          },
          {
            label: "Total screen time",
            value: timeText,
            icon: <EyeIcon className="size-8" />,
          },
          {
            label: "Total page length",
            value: 20,
            icon: <IconNotes className="size-8" />,
          },
          {
            label: "Total shooting time",
            value: 20,
            icon: <IconClock className="size-8" />,
          },
        ];
        return (
          <div className="flex justify-center items-center py-4">
            <SmallCards items={items} className="w-full" />
          </div>
        );
      })()}
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
        onRowClick={(item: any) => {
          setSelected(item);
          const label = String(item?.scene_id ?? item?.id ?? "");
          if (label) setDetailLabel(label);
          const id = String(item?.scene_uuid ?? "");
          if (id) router.push(`/scenes/${id}`);
        }}
        onFilteredDataChange={(rows: any[]) => {
          const nextKey = rows.map(computeId).join("|");
          if (nextKey !== visibleIdsKey) setVisibleRows(rows);
        }}
      />
    </>
  );
}
