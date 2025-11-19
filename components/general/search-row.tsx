"use client";

import * as React from "react";
import { SearchInput } from "@/components/ui/search-input";

type SelectOption = { value: string; label: string };

interface FilterConfig {
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

interface SearchConfig {
  query: string;
  setQuery: (q: string) => void;
  clear: () => void;
  placeholder?: string;
  ariaLabel?: string;
  containerClassName?: string;
}

interface SearchRowProps {
  filterConfig?: FilterConfig;
  searchConfig?: SearchConfig;
  rightActions?: React.ReactNode;
}

const SearchRow: React.FC<SearchRowProps> = ({
  searchConfig,
  rightActions,
}) => {
  const [local, setLocal] = React.useState(searchConfig?.query ?? "");
  React.useEffect(() => {
    if (!searchConfig) return;
    setLocal(searchConfig.query);
  }, [searchConfig?.query]);
  React.useEffect(() => {
    if (!searchConfig) return;
    const id = window.setTimeout(() => searchConfig.setQuery(local), 300);
    return () => window.clearTimeout(id);
  }, [local, searchConfig]);

  const SearchPart = (() => {
    if (!searchConfig) return null;
    const placeholder = searchConfig.placeholder || "Search";
    const ariaLabel = searchConfig.ariaLabel || "Search";
    const containerClassName = searchConfig.containerClassName || "w-full";
    return (
      <SearchInput
        value={local}
        onChange={setLocal}
        onClear={() => {
          searchConfig.clear();
          setLocal("");
        }}
        placeholder={placeholder}
        ariaLabel={ariaLabel}
        containerClassName={containerClassName}
      />
    );
  })();

  return (
    <div className="w-full flex items-end overflow-auto gap-2">
      <div className="flex-1">{SearchPart}</div>
      <div className="flex items-center gap-2">{rightActions}</div>
    </div>
  );
};

export default SearchRow;
