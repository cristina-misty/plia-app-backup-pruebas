"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Search, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

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
}: {
  title: string
  status: string[]
  onTitleChange: (v: string) => void
  onToggleStatus: (v: string) => void
  availableStatuses: { label: string; value: string; icon?: React.ComponentType<{ className?: string }> }[]
  onClearStatuses: () => void
  showStatus?: boolean
  searchEnabled?: boolean
  searchPlaceholder?: string
  filters?: {
    id: string
    label: string
    options: { label: string; value: string; icon?: React.ComponentType<{ className?: string }> }[]
    selected: string[]
    onToggle: (v: string) => void
    onClear: () => void
  }[]
  actions?: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-3">
      {searchEnabled && (
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
          <Input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-8"
            aria-label="Search"
          />
        </div>
      )}
      {filters && filters.length > 0 && (
        <>
          {filters.map((f) => (
            <React.Fragment key={f.id}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    {f.label}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-44">
                  {f.options.map(({ label, value, icon: Icon }) => (
                    <DropdownMenuCheckboxItem
                      key={value}
                      checked={f.selected.includes(value)}
                      onCheckedChange={() => f.onToggle(value)}
                      className="capitalize"
                    >
                      {Icon ? <Icon className="mr-2 h-4 w-4" /> : null}
                      {label}
                    </DropdownMenuCheckboxItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={f.onClear}>Clear</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="flex items-center gap-2">
                {f.selected.map((s) => (
                  <Badge key={`${f.id}-${s}`} variant="outline" className="capitalize">
                    {s}
                    <button
                      type="button"
                      aria-label={`Remove ${s}`}
                      className="ml-2 inline-flex items-center"
                      onClick={() => f.onToggle(s)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </React.Fragment>
          ))}
        </>
      )}
      {showStatus && (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              {availableStatuses.map(({ label, value }) => (
                <DropdownMenuCheckboxItem
                  key={value}
                  checked={status.includes(value)}
                  onCheckedChange={() => onToggleStatus(value)}
                  className="capitalize"
                >
                  {value === "active" ? (
                    <CheckCircle className="mr-2 h-4 w-4" />
                  ) : (
                    <XCircle className="mr-2 h-4 w-4" />
                  )}
                  {label}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onClearStatuses}>Clear</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex items-center gap-2">
            {status.map((s) => (
              <Badge key={s} variant="outline" className="capitalize">
                {s}
                <button
                  type="button"
                  aria-label={`Remove ${s}`}
                  className="ml-2 inline-flex items-center"
                  onClick={() => onToggleStatus(s)}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </>
      )}
      {actions}
    </div>
  )
}