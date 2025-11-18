"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useSeriesStore } from "@/store/series/series";
import { SeriesResponse } from "@/types/api/series";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import { Badge } from "../ui/badge";

export function TeamSwitcher({
  teams,
  loading = false,
}: {
  teams: {
    id?: string;
    name: string;
    logo: React.ElementType;
    plan: string;
  }[];
  loading?: boolean;
}) {
  const { isMobile } = useSidebar();
  const { series, currentSerie, setCurrentSerie } = useSeriesStore();

  const STORAGE_KEY = "plia:selectedSerieId";

  // Recuperar la serie activa desde localStorage al montar
  React.useEffect(() => {
    if (!series?.length) return;

    const storedId =
      typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;

    if (storedId && (!currentSerie || currentSerie.serie_uuid !== storedId)) {
      const match = series.find((s) => s.serie_uuid === storedId);
      if (match) setCurrentSerie(match);
    }
  }, [series, currentSerie, setCurrentSerie]);

  const activeTeam =
    teams.find((t) => t.id === currentSerie?.serie_uuid) ?? teams[0] ?? null;

  const handleSelect = (team: {
    id?: string;
    name: string;
    logo: React.ElementType;
    plan: string;
  }) => {
    const selectedSerie =
      (series || []).find(
        (s) => s.serie_uuid === team.id || s.serie_title === team.name
      ) ||
      ({
        serie_uuid: team.id || "",
        serie_title: team.name,
        serie_type: team.plan,
        serie_stage: team.plan,
        serie_timestamp: 0,
        serie_initials: team.name.slice(0, 2).toUpperCase(),
        serie_episodes: [],
        shootplan_uuid: undefined,
      } as SeriesResponse);

    setCurrentSerie(selectedSerie);

    // Guardar en localStorage
    try {
      if (typeof window !== "undefined") {
        const idToStore = selectedSerie.serie_uuid || team.id || "";
        if (idToStore) window.localStorage.setItem(STORAGE_KEY, idToStore);
      }
    } catch (e) {
      console.warn("[TeamSwitcher] No se pudo escribir localStorage:", e);
    }

    // Mostrar notificación
    toast.success(`Serie seleccionada: ${selectedSerie.serie_title}`);
  };

  const isEmpty = !loading && teams.length === 0;

  return (
    <SidebarMenu className="pt-4">
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
              disabled={isEmpty && !loading}
            >
              {loading ? (
                <SkeletonTeam />
              ) : isEmpty ? (
                <EmptyTeamDisplay />
              ) : activeTeam ? (
                <ActiveTeamDisplay team={activeTeam} />
              ) : (
                <EmptyTeamDisplay />
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Series
            </DropdownMenuLabel>

            {loading ? (
              <SkeletonList />
            ) : isEmpty ? (
              <div className="text-muted-foreground p-2 text-sm">
                No hay series disponibles
              </div>
            ) : (
              teams.map((team, index) => (
                <DropdownMenuItem
                  key={`serie-${index}`}
                  onClick={() => handleSelect(team)}
                  className="gap-2 p-2 cursor-pointer"
                >
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    <team.logo className="size-3.5 shrink-0" />
                  </div>
                  {team.name}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function SkeletonTeam() {
  return (
    <div className="flex items-center gap-3 w-full">
      <Badge variant="outline">
        <Spinner className="size-6" />
        Processing serie data
      </Badge>
      <Skeleton className="aspect-square size-8 rounded-lg" />
      <div className="grid flex-1 gap-1">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-2 w-16" />
      </div>
      <ChevronsUpDown className="ml-auto" />
    </div>
  );
}

function EmptyTeamDisplay() {
  return (
    <div className="flex items-center gap-3 w-full">
      <Badge variant="outline" className="gap-2"></Badge>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium text-muted-foreground">
          Sin series disponibles
        </span>
        <span className="truncate text-xs text-muted-foreground">
          Selecciona cuando haya datos
        </span>
      </div>
      <ChevronsUpDown className="ml-auto" />
    </div>
  );
}

function ActiveTeamDisplay({ team }: { team: any }) {
  return (
    <>
      <div className="bg-pink-600 text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
        <team.logo className="size-4" />
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">{team.name}</span>
        <span className="truncate text-xs">{team.plan}</span>
      </div>
      <ChevronsUpDown className="ml-auto" />
    </>
  );
}

function SkeletonList() {
  return (
    <div className="flex flex-col gap-2 p-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <Skeleton className="size-6 rounded-md" />
          <Skeleton className="h-3 w-32" />
        </div>
      ))}
    </div>
  );
}
