"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

export function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

export function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul className={cn("flex flex-row items-center gap-1", className)} {...props} />
  );
}

export function PaginationItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li className={cn("", className)} {...props} />;
}

type PaginationLinkProps = React.ComponentProps<"button"> & {
  isActive?: boolean;
};

export function PaginationLink({ className, isActive, disabled, ...props }: PaginationLinkProps) {
  return (
    <button
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background px-2 text-sm",
        "hover:bg-muted hover:text-muted-foreground",
        disabled && "pointer-events-none opacity-50",
        isActive && "bg-muted",
        className
      )}
      disabled={disabled}
      {...props}
    />
  );
}

export function PaginationPrevious({ className, disabled, ...props }: PaginationLinkProps) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      className={cn("gap-1 px-2.5", className)}
      disabled={disabled}
      {...props}
    >
      <IconChevronLeft className="size-4" />
    </PaginationLink>
  );
}

export function PaginationNext({ className, disabled, ...props }: PaginationLinkProps) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      className={cn("gap-1 px-2.5", className)}
      disabled={disabled}
      {...props}
    >
      <IconChevronRight className="size-4" />
    </PaginationLink>
  );
}

export function PaginationEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md text-sm text-muted-foreground",
        className
      )}
      {...props}
    >
      …
    </span>
  );
}