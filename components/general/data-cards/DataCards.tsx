"use client";

import * as React from "react";
import { create } from "zustand";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { normalizeString } from "@/lib/utils/search";
import { DataTableToolbar } from "@/components/data-table/DataTableToolbar";
import { getTailwindBorderClass } from "@/lib/utils/colors";

type FilterKey = { id: string; label: string; classNameTrigger?: string };

type DataCardsProps<T = any> = {
  data?: T[] | null;
  filterKeys?: FilterKey[];
  className?: string;
  renderItem: (item: T) => React.ReactNode;
  getItemClassName?: (item: T) => string | undefined;
  getItemBorderValue?: (item: T) => unknown;
  onItemClick?: (item: T) => void;
};

type LocalFiltersState = {
  filtersState: Record<string, string[]>;
  toggleFilterValue: (id: string, value: string) => void;
  clearFilterValues: (id: string) => void;
  clearAllFilters: () => void;
};

export default function DataCards<T = any>({
  data,
  filterKeys,
  className,
  renderItem,
  getItemClassName,
  getItemBorderValue,
  onItemClick,
}: DataCardsProps<T>) {
  const useLocalStore = React.useMemo(
    () =>
      create<LocalFiltersState>((set, get) => ({
        filtersState: {},
        toggleFilterValue: (id, value) => {
          const prev = get().filtersState[id] ?? [];
          const next = prev.includes(value)
            ? prev.filter((x) => x !== value)
            : [...prev, value];
          set({ filtersState: { ...get().filtersState, [id]: next } });
        },
        clearFilterValues: (id) => {
          const next = { ...get().filtersState };
          delete next[id];
          set({ filtersState: next });
        },
        clearAllFilters: () => set({ filtersState: {} }),
      })),
    []
  );

  const filtersState = useLocalStore((s) => s.filtersState);
  const toggleFilterValue = useLocalStore((s) => s.toggleFilterValue);
  const clearFilterValues = useLocalStore((s) => s.clearFilterValues);

  const rows = React.useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const filterOptionsMap = React.useMemo(() => {
    const map = new Map<string, { label: string; value: string }[]>();
    for (const fk of filterKeys ?? []) {
      const set = new Set<string>();
      for (const item of rows) {
        const v = (item as any)[fk.id as any];
        if (!v) continue;
        set.add(String(v));
      }
      const options = Array.from(set)
        .sort((a, b) => a.localeCompare(b))
        .map((v) => ({ label: v, value: v }));
      map.set(String(fk.id), options);
    }
    return map;
  }, [rows, filterKeys]);

  const filteredRows = React.useMemo(() => {
    return rows.filter((item) => {
      return (filterKeys ?? []).every((fk) => {
        const selected = filtersState[String(fk.id)] ?? [];
        if (!selected || selected.length === 0) return true;
        const v = (item as any)[fk.id as any];
        const nv = normalizeString(v);
        const set = new Set(selected.map((s) => normalizeString(s)));
        return set.has(nv);
      });
    });
  }, [rows, filtersState, filterKeys]);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center justify-between gap-2 overflow-auto py-2">
        <DataTableToolbar
          title={""}
          status={[]}
          onTitleChange={() => {}}
          onToggleStatus={() => {}}
          availableStatuses={[]}
          onClearStatuses={() => {}}
          showStatus={false}
          searchEnabled={false}
          filters={(filterKeys ?? []).map((fk) => {
            const options = filterOptionsMap.get(String(fk.id)) ?? [];
            const selected = filtersState[String(fk.id)] ?? [];
            return {
              id: String(fk.id),
              label: fk.label,
              options,
              selected,
              onToggle: (v: string) => toggleFilterValue(String(fk.id), v),
              onClear: () => clearFilterValues(String(fk.id)),
              classNameTrigger: fk.classNameTrigger,
            };
          })}
        />
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {filteredRows.map((item, idx) => (
          <Card
            key={idx}
            className={cn(
              "p-4 hover:bg-muted/40 transition-colors",
              getTailwindBorderClass(
                getItemBorderValue ? getItemBorderValue(item) : undefined
              ),
              getItemClassName ? getItemClassName(item) : undefined,
              onItemClick ? "cursor-pointer" : "cursor-default"
            )}
            role={onItemClick ? "button" : undefined}
            tabIndex={onItemClick ? 0 : undefined}
            onClick={onItemClick ? () => onItemClick(item) : undefined}
            onKeyDown={
              onItemClick
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") onItemClick(item);
                  }
                : undefined
            }
          >
            {renderItem(item)}
          </Card>
        ))}
        {filteredRows.length === 0 && (
          <div className="text-sm text-muted-foreground">No results</div>
        )}
      </div>
    </div>
  );
}
