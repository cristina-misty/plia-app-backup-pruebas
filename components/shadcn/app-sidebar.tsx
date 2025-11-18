"use client";

import * as React from "react";
import { useSession } from "next-auth/react"; // 👈 importar
import Image from "next/image";
import {
  IconCamera,
  IconChairDirector,
  IconFileText,
  IconLayoutDashboard,
  IconMapPinFilled,
  IconMovie,
  IconUsersGroup,
} from "@tabler/icons-react";

import { NavMain } from "@/components/shadcn/nav-main";
import { NavUser } from "@/components/shadcn/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { useSeriesStore } from "@/store/series/series";
import { Film } from "lucide-react";
import { Separator } from "../ui/separator";
import { TeamSwitcher } from "./team-switcher";
import { ModeToggle } from "./toggle-theme";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  const { series, loading } = useSeriesStore();

  // 🔹 Si no hay series todavía, mostramos un fallback
  const teams =
    series && Array.isArray(series)
      ? series.map((s) => ({
          id: s.serie_uuid,
          name: s.serie_title,
          logo: Film,
          plan: s.serie_type || "default",
        }))
      : [];

  // 🔹 Si no hay usuario todavía, mostramos un fallback
  const user = session?.user ?? {
    name: "Invitado",
    email: "sin sesión",
    image: undefined,
  };

  const data = {
    user: {
      name: user.name,
      email: user.email,
      avatar: user.image,
    },
    navMain: [
      { title: "Dashboard", url: "/dashboard", icon: IconLayoutDashboard },
      { title: "Scenes", url: "/scenes", icon: IconChairDirector },
      /*      { title: "PLIA Assistant", url: "#", icon: IconRobot },
      { title: "Crew Management", url: "#", icon: IconUsersGroup },
      { title: "Locations", url: "#", icon: IconMapPinFilled },
      { title: "Shot list", url: "#", icon: IconList }, */
    ],
    navClouds: [
      {
        title: "Capture",
        icon: IconCamera,
        isActive: true,
        url: "#",
        items: [
          { title: "Active Proposals", url: "#" },
          { title: "Archived", url: "#" },
        ],
      },
    ],

    documents: [
      /*       { name: "Data Library", url: "#", icon: IconDatabase },
      { name: "Reports", url: "#", icon: IconReport },
      { name: "Word Assistant", url: "#", icon: IconFileWord }, */
    ],
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex">
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:p-1.5!"
              >
                <a href="#">
                  <Image
                    src="/assets/PLIA_isotipo5.png"
                    alt="PLIA"
                    width={30}
                    height={30}
                  />
                  <span className="text-base font-semibold">PLIA</span>
                </a>
              </SidebarMenuButton>
              <ModeToggle />
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Separator className="my-2" />
            {/* Mostrar siempre el TeamSwitcher. Si no hay series, se mostrará estado vacío dentro del componente */}
            <TeamSwitcher teams={teams} loading={loading} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
