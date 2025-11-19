/* -------- useSearchFilters ---------- */
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

/* -------- search row ---------- */

type SelectOption = { value: string; label: string };

export interface FilterConfig {
  value?: string | string[];
  setValue?: ((v: string) => void) | ((v: string[]) => void);
  toggle?: (v: string) => void;
  clear?: () => void;
  options: SelectOption[];
  placeholder?: string;
  ariaLabel?: string;
  containerClassName?: string;
  multiple?: boolean;
}

export interface SearchConfig {
  query: string;
  setQuery: (q: string) => void;
  clear: () => void;
  placeholder?: string;
  ariaLabel?: string;
  containerClassName?: string;
}

export type ViewMode = "table" | "cards" | "charts";
export interface SearchRowProps {
  filterConfig?: FilterConfig;
  searchConfig?: SearchConfig;
  viewMode?: ViewMode;
  onChangeViewMode?: (v: ViewMode) => void;
  chartsEnabled?: boolean;
}
