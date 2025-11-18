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
}: {
  title: string
  status: string[]
  onTitleChange: (v: string) => void
  onToggleStatus: (v: string) => void
  availableStatuses: { label: string; value: string; icon?: React.ComponentType }[]
  onClearStatuses: () => void
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-64">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
        <Input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Search titles..."
          className="pl-8"
          aria-label="Filter by title"
        />
      </div>
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
    </div>
  )
}