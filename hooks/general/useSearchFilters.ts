"use client";

import * as React from "react";
import { create } from "zustand";
import { normalizeString, buildHaystack } from "@/lib/utils/search";
import {
  HaystackGetter,
  LocalSearchState,
  UseSearchOptions,
} from "@/types/general/search";

export function useSearchFilters<T = any>(
  items: T[] | null | undefined,
  options?: UseSearchOptions<T>
) {
  const useLocalStore = React.useMemo(
    () =>
      create<LocalSearchState>((set, get) => ({
        query: "",
        filters: [],
        setQuery: (q) => set({ query: q }),
        clearQuery: () => set({ query: "" }),
        setFilters: (v) => set({ filters: Array.isArray(v) ? v : [] }),
        toggleFilter: (v) => {
          const current = new Set<string>(get().filters);
          if (current.has(v)) current.delete(v);
          else current.add(v);
          set({ filters: Array.from(current) });
        },
        clearFilters: () => set({ filters: [] }),
      })),
    []
  );

  const query = useLocalStore((s) => s.query);
  const setQuery = useLocalStore((s) => s.setQuery);
  const clearQuery = useLocalStore((s) => s.clearQuery);
  const filters = useLocalStore((s) => s.filters);
  const setFilters = useLocalStore((s) => s.setFilters);
  const toggleFilter = useLocalStore((s) => s.toggleFilter);
  const clearFilters = useLocalStore((s) => s.clearFilters);

  const filterOptions = React.useMemo(() => {
    const set = new Set<string>();
    const key = options?.filterKey ?? "";
    if (!key) return [] as { value: string; label: string }[];
    for (const r of items ?? []) {
      const v = String((r as any)?.[key] ?? "");
      if (!v) continue;
      set.add(v);
    }
    return Array.from(set)
      .sort((a, b) => a.localeCompare(b))
      .map((v) => ({ value: v, label: v }));
  }, [items, options?.filterKey]);

  const filtered = React.useMemo(() => {
    const rows = Array.isArray(items) ? items : [];
    const q = normalizeString(query);
    const hasQ = Boolean(q);
    const fset = new Set((filters ?? []).map((x) => normalizeString(x)));
    const key = options?.filterKey ?? "";
    const getHaystack: HaystackGetter<any> = options?.getHaystack
      ? options.getHaystack
      : (r: any) => Object.values(r ?? {});
    return rows.filter((r: any) => {
      const value = getHaystack(r);
      const haystack = Array.isArray(value)
        ? buildHaystack(value)
        : normalizeString(value);
      const matchQ = !hasQ || haystack.includes(q);
      const fk = key ? (r as any)?.[key] : undefined;
      const matchFk = key
        ? fset.size === 0 || fset.has(normalizeString(String(fk ?? "")))
        : true;
      return matchQ && matchFk;
    });
  }, [items, query, filters, options?.getHaystack, options?.filterKey]);

  return {
    query,
    setQuery,
    clearQuery,
    filters,
    setFilters,
    toggleFilter,
    clearFilters,
    filterOptions,
    filtered,
  };
}
