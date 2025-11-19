"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  MultiSelect,
  MultiSelectTrigger,
  MultiSelectValue,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectSeparator,
} from "@/components/ui/multi-select";

export function DataTableToolbar({
  title,
  status,
  onTitleChange,
  onToggleStatus,
  availableStatuses,
  onClearStatuses,
  showStatus = true,
  searchEnabled = true,
  searchPlaceholder = "Search...",
  filters,
  actions,
  loading,
}: {
  title: string;
  status: string[];
  onTitleChange: (v: string) => void;
  onToggleStatus: (v: string) => void;
  availableStatuses: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  onClearStatuses: () => void;
  showStatus?: boolean;
  searchEnabled?: boolean;
  searchPlaceholder?: string;
  filters?: {
    id: string;
    label: string;
    options: {
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
    }[];
    selected: string[];
    onToggle: (v: string) => void;
    onClear: () => void;
    classNameTrigger?: string;
    classNameContent?: string;
  }[];
  actions?: React.ReactNode;
  loading?: boolean;
}) {
  const [q, setQ] = React.useState(title);
  React.useEffect(() => {
    setQ(title);
  }, [title]);
  React.useEffect(() => {
    const id = window.setTimeout(() => {
      onTitleChange(q);
    }, 200);
    return () => window.clearTimeout(id);
  }, [q, onTitleChange]);
  return (
    <div className="flex items-center gap-3">
      {searchEnabled && (
        <div className="relative w-40">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 opacity-50" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-8"
            aria-label="Search"
            aria-busy={loading ? true : false}
          />
          {loading && (
            <span className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center text-muted-foreground">
              <svg className="animate-spin size-4" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span>
          )}
        </div>
      )}
      {filters && filters.length > 0 && (
        <>
          {filters.map((f) => (
            <MultiSelect
              key={f.id}
              values={f.selected}
              onValuesChange={(vals) => {
                const next = new Set(vals);
                const prev = new Set(f.selected);
                Array.from(next).forEach((v) => {
                  if (!prev.has(v)) f.onToggle(v);
                });
                Array.from(prev).forEach((v) => {
                  if (!next.has(v)) f.onToggle(v);
                });
              }}
            >
              <MultiSelectTrigger size="sm" className={f.classNameTrigger}>
                {f.label}
                <MultiSelectValue placeholder="" />
              </MultiSelectTrigger>
              <MultiSelectContent search={{ placeholder: f.label }}>
                <MultiSelectGroup>
                  {f.options.map(({ label, value }) => (
                    <MultiSelectItem
                      key={value}
                      value={value}
                      badgeLabel={label}
                    >
                      {label}
                    </MultiSelectItem>
                  ))}
                </MultiSelectGroup>
                <MultiSelectSeparator />
                <div className="px-2 py-1.5">
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => f.onClear()}
                    aria-label={`Clear ${f.label}`}
                  >
                    Clear filters
                  </Button>
                </div>
              </MultiSelectContent>
            </MultiSelect>
          ))}
        </>
      )}
      {showStatus && (
        <MultiSelect
          values={status}
          onValuesChange={(vals) => {
            const next = new Set(vals);
            const prev = new Set(status);
            Array.from(next).forEach((v) => {
              if (!prev.has(v)) onToggleStatus(v);
            });
            Array.from(prev).forEach((v) => {
              if (!next.has(v)) onToggleStatus(v);
            });
          }}
        >
          <MultiSelectTrigger size="sm">
            Status
            <MultiSelectValue placeholder="" />
          </MultiSelectTrigger>
          <MultiSelectContent search={{ placeholder: "Status" }}>
            <MultiSelectGroup>
              {availableStatuses.map(({ label, value }) => (
                <MultiSelectItem key={value} value={value} badgeLabel={label}>
                  {label}
                </MultiSelectItem>
              ))}
            </MultiSelectGroup>
          </MultiSelectContent>
        </MultiSelect>
      )}
      {actions}
    </div>
  );
}
