"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { IconSearch, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

type SearchInputProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
  containerClassName?: string;
};

export const SearchInput: React.FC<SearchInputProps> = ({
  id = "search-input",
  value,
  onChange,
  onClear,
  placeholder = "Search...",
  ariaLabel = "Search",
  className,
  containerClassName,
}) => {
  return (
    <div className={cn("relative", containerClassName)} role="search">
      <label htmlFor={id} className="sr-only">
        {ariaLabel}
      </label>
      <IconSearch
        aria-hidden="true"
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4"
      />
      <Input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn("pl-9", className)}
        aria-label={ariaLabel}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-md p-1 text-muted-foreground hover:text-foreground focus-visible:ring-ring focus-visible:border-ring focus-visible:ring-[3px] outline-none"
        >
          <IconX className="size-4" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;