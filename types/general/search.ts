export type HaystackGetter<T> = (row: T) => string | Array<unknown>;

export interface UseSearchOptions<T> {
  getHaystack?: HaystackGetter<T>;
  filterKey?: string;
}

export interface LocalSearchState {
  query: string;
  filters: string[];
  setQuery: (q: string) => void;
  clearQuery: () => void;
  setFilters: (v: string[]) => void;
  toggleFilter: (v: string) => void;
  clearFilters: () => void;
}
