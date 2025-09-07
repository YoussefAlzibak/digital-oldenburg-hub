import { 
  Home,
  Users, 
  CalendarDays, 
  Calendar,
  BarChart3,
  Mail, 
  UserCheck,
  RotateCcw,
  Settings,
  MoreHorizontal
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const mainNavItems = [
  { title: "Home", url: "/admin", icon: Home, exact: true },
  { title: "Anfragen", url: "/admin/requests", icon: Users },
  { title: "Termine", url: "/admin/appointments", icon: CalendarDays },
  { title: "Kalender", url: "/admin/calendar", icon: Calendar },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
];

const moreItems = [
  { title: "Marketing", url: "/admin/email-marketing", icon: Mail },
  { title: "Abonnenten", url: "/admin/subscribers", icon: UserCheck },
  { title: "Verlängerungen", url: "/admin/renewals", icon: RotateCcw },
  { title: "E-Mail Einstellungen", url: "/admin/email-settings", icon: Settings },
  { title: "Kalender Einstellungen", url: "/admin/calendar-settings", icon: Calendar },
];

export function MobileBottomNav() {
  const location = useLocation();
  
  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const hasMoreItemActive = moreItems.some(item => isActive(item.url));

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-[9999] shadow-lg">
      <div className="flex justify-around items-center h-16 px-2">
        {mainNavItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            end={item.exact}
            className={cn(
              "flex flex-col items-center justify-center min-w-0 flex-1 px-1 py-2 rounded-lg transition-colors",
              isActive(item.url, item.exact)
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            )}
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium truncate max-w-full">{item.title}</span>
          </NavLink>
        ))}
        
        {/* More menu dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "flex flex-col items-center justify-center min-w-0 flex-1 px-1 py-2 rounded-lg h-auto",
                hasMoreItemActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              <MoreHorizontal className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">Mehr</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 mb-2">
            {moreItems.map((item) => (
              <DropdownMenuItem key={item.title} asChild>
                <NavLink
                  to={item.url}
                  className={cn(
                    "flex items-center gap-2 w-full px-2 py-1.5 text-sm cursor-pointer",
                    isActive(item.url) && "bg-accent text-accent-foreground font-medium"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </NavLink>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}