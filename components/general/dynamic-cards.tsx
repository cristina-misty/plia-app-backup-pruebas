"use client";

import * as React from "react";
import type { ElementType } from "react";
import { create } from "zustand";
import SmallCards from "@/components/general/small-cards";

type IconLike =
  | ElementType
  | React.ReactNode
  | ((value: string | number) => React.ReactNode);

type GroupConfig<T> = {
  by: ((item: T) => string | number) | string;
  label?: (value: string | number) => string;
  icon?: IconLike;
  sort?: "valueDesc" | "valueAsc" | "labelAsc" | "labelDesc";
  limit?: number;
  onCardClick?: (value: string | number) => void;
  ariaLabel?: (value: string | number, count: number) => string;
};

type DynamicCardsProps<T = any> = {
  data?: T[] | null;
  group: GroupConfig<T>;
  className?: string;
};

type CardsState = {
  selected?: string | number | null;
  setSelected: (v: string | number | null) => void;
};

function useLocalCardsStore() {
  const useStore = React.useMemo(
    () =>
      create<CardsState>((set) => ({
        selected: null,
        setSelected: (v) => set({ selected: v }),
      })),
    []
  );
  const selected = useStore((s) => s.selected);
  const setSelected = useStore((s) => s.setSelected);
  return { selected, setSelected };
}

export default function DynamicCards<T = any>({
  data,
  group,
  className,
}: DynamicCardsProps<T>) {
  const rows = React.useMemo(() => (Array.isArray(data) ? data : []), [data]);
  const { selected, setSelected } = useLocalCardsStore();

  const getKey = React.useMemo(() => {
    if (typeof group.by === "string") {
      const key = group.by as string;
      return (item: any) => String(item?.[key] ?? "");
    }
    return (item: T) => String((group.by as (i: T) => string | number)(item));
  }, [group.by]);

  const counts = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const r of rows) {
      const k = getKey(r);
      if (!k) continue;
      map.set(k, (map.get(k) ?? 0) + 1);
    }
    return map;
  }, [rows, getKey]);

  const items = React.useMemo(() => {
    const entries = Array.from(counts.entries());
    const sort = group.sort ?? "labelAsc";
    entries.sort((a, b) => {
      if (sort === "valueDesc") return b[1] - a[1];
      if (sort === "valueAsc") return a[1] - b[1];
      if (sort === "labelDesc") return String(b[0]).localeCompare(String(a[0]));
      return String(a[0]).localeCompare(String(b[0]));
    });
    const limited =
      typeof group.limit === "number" ? entries.slice(0, group.limit) : entries;
    return limited.map(([value, count]) => {
      const label = group.label ? group.label(value) : String(value);
      const iconDef = group.icon;
      const iconEl = iconDef
        ? typeof iconDef === "function"
          ? (iconDef as (v: string | number) => React.ReactNode)(value)
          : iconDef
        : undefined;
      const onClick = group.onCardClick
        ? () => {
            setSelected(value);
            group.onCardClick?.(value);
          }
        : undefined;
      const aria = group.ariaLabel
        ? group.ariaLabel(value, count)
        : `${label}: ${count}`;
      return { label, value: count, icon: iconEl, onClick, aria } as any;
    });
  }, [
    counts,
    group.label,
    group.icon,
    group.onCardClick,
    group.sort,
    group.limit,
    setSelected,
  ]);

  return (
    <div className={className}>
      <SmallCards
        items={items.map((it: any) => ({
          label: it.label,
          value: it.value,
          icon: it.icon,
          onClick: it.onClick,
          ariaLabel: it.aria,
        }))}
      />
    </div>
  );
}
