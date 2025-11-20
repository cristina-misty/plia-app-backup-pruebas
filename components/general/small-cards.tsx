"use client";

import * as React from "react";
import type { ElementType } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type SmallCardItem = {
  label: string;
  value: React.ReactNode;
  icon?: ElementType | React.ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
};

type SmallCardsProps = {
  items: SmallCardItem[];
  className?: string;
};

export default function SmallCards({ items, className }: SmallCardsProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {items.map((it, idx) => {
        const IconEl = it.icon;
        const iconContent = IconEl
          ? React.isValidElement(IconEl)
            ? IconEl
            : typeof IconEl === "function"
            ? React.createElement(IconEl as ElementType, {
                className: "size-4 text-muted-foreground",
              })
            : null
          : null;
        return (
          <Card
            key={idx}
            className={cn(
              "p-3 flex items-center gap-3 py-6 cursor-default",
              it.onClick && "cursor-pointer hover:bg-muted/50 transition-colors"
            )}
            onClick={it.onClick}
            role={it.onClick ? "button" : undefined}
            tabIndex={it.onClick ? 0 : undefined}
            aria-label={it.ariaLabel ?? it.label}
            onKeyDown={
              it.onClick
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") it.onClick?.();
                  }
                : undefined
            }
          >
            <div className="flex items-center gap-2 max-w-lg w-full">
              {iconContent}
              <div className="flex flex-col items-start">
                <span className="text-md text-muted-foreground leading-none">
                  {it.label}
                </span>
                <span className="text-2xl font-extrabold leading-tight">
                  {it.value}
                </span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
