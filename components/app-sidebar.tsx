"use client";

import * as React from "react";
import { useSession } from "next-auth/react"; // 👈 importar
import Image from "next/image";
import {
  IconCamera,
  IconCameraFilled,
  IconDatabase,
  IconFileWord,
  IconLayoutDashboard,
  IconList,
  IconMapPinFilled,
  IconReport,
  IconRobot,
  IconUsersGroup,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ModeToggle } from "./toggle-theme";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();

  const user = session?.user ?? {
    name: "Invitado",
    email: "sin sesión",
    image: "/avatars/default.png",
  };

  const data = {
    user: {
      name: user.name,
      email: user.email,
      avatar: user.image,
    },
    navMain: [
      { title: "Dashboard", url: "#", icon: IconLayoutDashboard },
      { title: "Shooting plans", url: "#", icon: IconCameraFilled },
      { title: "PLIA Assistant", url: "#", icon: IconRobot },
      { title: "Crew Management", url: "#", icon: IconUsersGroup },
      { title: "Locations", url: "#", icon: IconMapPinFilled },
      { title: "Shot list", url: "#", icon: IconList },
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
    /*     navSecondary: [
      { title: "Settings", url: "#", icon: IconSettings },
      { title: "Get Help", url: "#", icon: IconHelp },
      { title: "Search", url: "#", icon: IconSearch },
    ], */
    documents: [
      { name: "Data Library", url: "#", icon: IconDatabase },
      { name: "Reports", url: "#", icon: IconReport },
      { name: "Word Assistant", url: "#", icon: IconFileWord },
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
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        {/*         <NavSecondary items={data.navSecondary} className="mt-auto" />
         */}
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
