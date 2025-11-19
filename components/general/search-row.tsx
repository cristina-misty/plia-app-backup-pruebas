"use client";

import * as React from "react";
import { SearchInput } from "@/components/ui/search-input";
import { SearchRowProps } from "@/types/general/search";
import { ToggleViewGroup } from "./toggle-view";

const SearchRow: React.FC<SearchRowProps> = ({
  searchConfig,
  viewMode,
  onChangeViewMode,
  chartsEnabled,
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
    <div className="w-full flex items-end overflow-auto gap-2 mb-2">
      <div className="flex-1">{SearchPart}</div>
      <div className="flex items-center gap-2">
        <ToggleViewGroup
          className="inline-flex"
          value={viewMode}
          onChange={onChangeViewMode}
          chartsEnabled={chartsEnabled}
        />
      </div>
    </div>
  );
};

export default SearchRow;
