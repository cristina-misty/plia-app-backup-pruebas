"use client";

import * as React from "react";

interface EmptyProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Simple Empty state component using shadcn/ui styles.
 * Displays a centered message with optional icon and description.
 */
export function Empty({
  title = "Sin resultados",
  description,
  icon,
  className = "",
  children,
}: EmptyProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center rounded-md border border-dashed py-12 px-4 text-muted-foreground ${className}`}
    >
      {icon ? <div className="mb-3">{icon}</div> : null}
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {description ? (
        <p className="mt-1 text-sm text-muted-foreground max-w-md">{description}</p>
      ) : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}