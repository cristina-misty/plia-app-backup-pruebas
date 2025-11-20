"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import type { ComponentType } from "react";
import type { IconProps } from "@tabler/icons-react";
import {
  IconDotsVertical,
  IconEye,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";

export interface TableActionItem<T> {
  label: string;
  icon?: ComponentType<IconProps>;
  onClick?: (item: T) => void;
  getHref?: (item: T) => string;
  hrefBase?: string;
  getId?: (item: T) => string;
  disabled?: boolean;
  danger?: boolean;
  target?: "_self" | "_blank" | "_parent" | "_top";
  className?: string;
}

export interface TableActionsMenuProps<T> {
  item: T;
  actions?: TableActionItem<T>[];
  onBeforeNavigate?: (item: T) => void;
  title?: string;
  triggerVariant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "ghost"
    | "link";
  triggerSize?: "default" | "sm" | "lg" | "icon";
  className?: string;
  defaultTarget?: "_self" | "_blank" | "_parent" | "_top";
}

export function TableActionsMenu<T>({
  item,
  actions,
  onBeforeNavigate,
  title = "Acciones",
  triggerVariant = "outline",
  triggerSize = "icon",
  className,
  defaultTarget = "_self",
}: TableActionsMenuProps<T>) {
  const router = useRouter();

  const defaultActions: TableActionItem<T>[] = [
    { label: "Ver", icon: IconEye },
    { label: "Editar", icon: IconEdit },
    { label: "Eliminar", icon: IconTrash, danger: true },
  ];

  const finalActions = actions && actions.length ? actions : defaultActions;

  // Pequeña función para diferir la navegación y permitir que el estado
  // (por ejemplo, Zustand + sessionStorage) se haya persistido antes de cargar la nueva ruta.
  const navigateAfterState = (
    href: string,
    target: "_self" | "_blank" | "_parent" | "_top" = "_self"
  ) => {
    setTimeout(() => {
      if (target && target !== "_self") {
        window.open(href, target, "noopener,noreferrer");
      } else {
        router.push(href);
      }
    }, 0);
  };

  const handleItem = (action: TableActionItem<T>) => {
    if (action.disabled) return;

    if (action.onClick) {
      action.onClick(item);
      return;
    }
    // Navegación antes de cambiar ruta
    onBeforeNavigate?.(item);
    // Navegación por href generado
    if (action.getHref) {
      const href = action.getHref(item);
      navigateAfterState(href, action.target ?? defaultTarget);
      return;
    }
    // Navegación por base + id
    if (action.hrefBase && action.getId) {
      const id = action.getId(item);
      navigateAfterState(
        `${action.hrefBase}/${id}`,
        action.target ?? defaultTarget
      );
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={triggerVariant}
          size={triggerSize}
          className={className}
          aria-label="Más acciones"
        >
          <IconDotsVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={4} className="w-40">
        {finalActions.map((a, idx) => {
          const Icon = a.icon ?? IconEye;
          return (
            <DropdownMenuItem
              key={`${a.label}-${idx}`}
              onClick={() => handleItem(a)}
              disabled={a.disabled}
              className={
                a.danger
                  ? "text-destructive focus:text-destructive cursor-pointer"
                  : "cursor-pointer"
              }
            >
              <Icon className="mr-2 h-4 w-4" /> {a.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default TableActionsMenu;
