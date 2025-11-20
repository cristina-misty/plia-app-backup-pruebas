"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useBreadcrumbStore } from "@/store/general/breadcrumb";

export function SiteHeader() {
  const pathname = usePathname();
  const detailLabel = useBreadcrumbStore((s) => s.detailLabel);

  const segments = pathname.split("/").filter(Boolean);

  const isRoot = segments.length === 0;

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center justify-between gap-1 px-4 lg:gap-2 lg:px-6">
        {/* Sidebar */}
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />

          {/* 🧭 Breadcrumbs */}
          <Breadcrumb>
            <BreadcrumbList>
              {/* HOME */}
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/dashboard">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              {/* Separadores + niveles */}
              {segments.map((segment, index) => {
                const href = "/" + segments.slice(0, index + 1).join("/");
                const isLast = index === segments.length - 1;
                const isId = /^[0-9a-fA-F-]{6,}$/.test(segment);
                const baseLabel = formatSegment(segment);
                const label =
                  isLast && isId && detailLabel ? `${detailLabel}` : baseLabel;

                return (
                  <div key={href} className="flex items-center">
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage>{label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link href={href}>{label}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </div>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
    </header>
  );
}

function formatSegment(segment: string) {
  // Si parece un UUID o ID, lo reemplazamos por "Detail"
  if (/^[0-9a-fA-F-]{6,}$/.test(segment)) return "Detail";
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}
