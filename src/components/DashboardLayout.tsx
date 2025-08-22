import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        
        <main className="flex-1 flex flex-col">
          {/* Header with trigger */}
          <header className="h-12 flex items-center border-b bg-background px-4">
            <SidebarTrigger className="mr-4" />
            <div className="flex-1" />
          </header>
          
          {/* Main content */}
          <div className="flex-1 p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}