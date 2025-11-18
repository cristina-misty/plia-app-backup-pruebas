import { AppSidebar } from "@/components/shadcn/app-sidebar";
import { ChatRoundedButton } from "@/components/chatbot/ChatRoundedButton";
import { SiteHeader } from "@/components/shadcn/site-header";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            {children}
          </div>
        </div>
      </SidebarInset>
      {/* Solo visible en mobile */}

      <ChatRoundedButton />

      {/* Solo visible en desktop */}
      {/*       <div className="hidden sm:block">
        <ChatButtonModal />
      </div> */}
    </SidebarProvider>
  );
}
