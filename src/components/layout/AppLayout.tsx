
import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-h-screen w-full bg-slate-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b border-slate-200 bg-white/95 backdrop-blur-sm flex items-center px-4 sticky top-0 z-50 lg:z-40">
            <SidebarTrigger className="mr-2 lg:mr-4" />
            <div className="flex-1" />
          </header>
          <main className="flex-1 overflow-auto">
            <div className="w-full h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
