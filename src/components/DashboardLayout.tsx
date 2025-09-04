import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import DashboardNotifications from "./DashboardNotifications";
import { MobileBottomNav } from "./MobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Desktop Sidebar - hidden on mobile */}
        {!isMobile && <DashboardSidebar />}
        
        <main className="flex-1 flex flex-col">
          {/* Header with trigger and notifications */}
          <header className="h-12 flex items-center border-b bg-background px-4">
            {!isMobile && <SidebarTrigger className="mr-4" />}
            <div className="flex-1" />
            <DashboardNotifications />
          </header>
          
          {/* Main content - add bottom padding on mobile for nav */}
          <div className={`flex-1 p-4 md:p-6 ${isMobile ? 'pb-20' : ''}`}>
            {children}
          </div>
        </main>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </SidebarProvider>
  );
}