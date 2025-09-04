import { 
  Home,
  Users, 
  CalendarDays, 
  Mail, 
  UserCheck,
  Settings
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Home", url: "/admin", icon: Home, exact: true },
  { title: "Anfragen", url: "/admin/requests", icon: Users },
  { title: "Termine", url: "/admin/appointments", icon: CalendarDays },
  { title: "Marketing", url: "/admin/email-marketing", icon: Mail },
  { title: "Abonnenten", url: "/admin/subscribers", icon: UserCheck },
  { title: "Settings", url: "/admin/email-settings", icon: Settings },
];

export function MobileBottomNav() {
  const location = useLocation();
  
  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => (
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
      </div>
    </nav>
  );
}