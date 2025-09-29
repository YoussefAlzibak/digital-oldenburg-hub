import { useState } from "react";
import { 
  BarChart3, 
  Users, 
  Calendar, 
  Mail, 
  Settings, 
  RotateCcw, 
  Home,
  CalendarDays,
  UserCheck,
  Shield,
  ArrowLeft,
  LogOut
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const mainItems = [
  { title: "Übersicht", url: "/admin", icon: Home, exact: true },
  { title: "Anfragen", url: "/admin/requests", icon: Users },
  { title: "Termine", url: "/admin/appointments", icon: CalendarDays },
  { title: "Kalender", url: "/admin/calendar", icon: Calendar },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
];

const emailItems = [
  { title: "Abonnenten", url: "/admin/subscribers", icon: UserCheck },
  { title: "Marketing", url: "/admin/email-marketing", icon: Mail },
  { title: "Verlängerungen", url: "/admin/renewals", icon: RotateCcw },
];

const settingsItems = [
  { title: "E-Mail Einstellungen", url: "/admin/email-settings", icon: Settings },
  { title: "Kalender Einstellungen", url: "/admin/calendar-settings", icon: Calendar },
];

export function DashboardSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentPath = location.pathname;

  const handleLogout = async () => {
    try {
      // Clean up auth state
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        console.warn('Global signout failed:', err);
      }

      toast({
        title: "Erfolgreich abgemeldet",
        description: "Sie wurden sicher abgemeldet.",
      });

      // Force page reload for clean state
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Abmeldung fehlgeschlagen",
        description: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
        variant: "destructive"
      });
    }
  };

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return currentPath === path;
    }
    return currentPath === path || currentPath.startsWith(path);
  };

  const getNavCls = (item: { url: string, exact?: boolean }) => 
    isActive(item.url, item.exact) 
      ? "bg-accent text-accent-foreground font-medium" 
      : "hover:bg-accent/50";

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <h2 className="text-lg font-semibold">Admin Panel</h2>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Verwaltung</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.exact} className={getNavCls(item)}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>E-Mail Marketing</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {emailItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls(item)}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Einstellungen</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls(item)}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="justify-start w-full"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="ml-2">Zurück zur Website</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="justify-start w-full text-muted-foreground hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          <span className="ml-2">Abmelden</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}