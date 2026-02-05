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
  MoreHorizontal,
  Star,
  Send,
  FileText,
  GitBranch,
  ArrowLeft,
  LogOut
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const mainNavItems = [
  { title: "Home", url: "/admin", icon: Home, exact: true },
  { title: "Anfragen", url: "/admin/requests", icon: Users },
  { title: "Termine", url: "/admin/appointments", icon: CalendarDays },
  { title: "Kalender", url: "/admin/calendar", icon: Calendar },
];

const moreItems = [
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3, section: "Verwaltung" },
  { title: "Bewertungen", url: "/admin/reviews", icon: Star, section: "Verwaltung" },
  { title: "Abonnenten", url: "/admin/subscribers", icon: UserCheck, section: "E-Mail Marketing" },
  { title: "Marketing", url: "/admin/email-marketing", icon: Mail, section: "E-Mail Marketing" },
  { title: "Kampagnen", url: "/admin/campaigns", icon: Send, section: "E-Mail Marketing" },
  { title: "Templates", url: "/admin/templates", icon: FileText, section: "E-Mail Marketing" },
  { title: "Automatisierungen", url: "/admin/automations", icon: RotateCcw, section: "E-Mail Marketing" },
  { title: "Workflow-Builder", url: "/admin/workflow-builder", icon: GitBranch, section: "E-Mail Marketing" },
  { title: "Verlängerungen", url: "/admin/renewals", icon: Calendar, section: "E-Mail Marketing" },
  { title: "E-Mail Einstellungen", url: "/admin/email-settings", icon: Settings, section: "Einstellungen" },
  { title: "Kalender Einstellungen", url: "/admin/calendar-settings", icon: Calendar, section: "Einstellungen" },
];

export function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sheetOpen, setSheetOpen] = useState(false);
  
  // Only show on admin routes
  if (!location.pathname.startsWith('/admin')) {
    return null;
  }

  const handleLogout = async () => {
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.warn('Global signout failed:', err);
      }

      toast({
        title: "Erfolgreich abgemeldet",
        description: "Sie wurden sicher abgemeldet.",
      });

      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Abmeldung fehlgeschlagen",
        description: "Ein Fehler ist aufgetreten.",
        variant: "destructive"
      });
    }
  };
  
  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const hasMoreItemActive = moreItems.some(item => isActive(item.url));

  // Group items by section
  const groupedItems = moreItems.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, typeof moreItems>);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-[9999] shadow-lg safe-area-bottom">
      <div className="flex justify-around items-center h-16 px-1">
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
            <item.icon className="h-5 w-5 mb-0.5" />
            <span className="text-[10px] font-medium truncate max-w-full">{item.title}</span>
          </NavLink>
        ))}
        
        {/* More menu with Sheet */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "flex flex-col items-center justify-center min-w-0 flex-1 px-1 py-2 rounded-lg h-auto",
                hasMoreItemActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              <MoreHorizontal className="h-5 w-5 mb-0.5" />
              <span className="text-[10px] font-medium">Mehr</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl">
            <SheetHeader className="pb-4">
              <SheetTitle className="text-left">Dashboard Navigation</SheetTitle>
            </SheetHeader>
            
            <div className="overflow-y-auto h-[calc(100%-8rem)] space-y-6">
              {Object.entries(groupedItems).map(([section, items]) => (
                <div key={section}>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                    {section}
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {items.map((item) => (
                      <NavLink
                        key={item.title}
                        to={item.url}
                        onClick={() => setSheetOpen(false)}
                        className={cn(
                          "flex flex-col items-center justify-center p-3 rounded-xl transition-all",
                          isActive(item.url)
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "bg-muted/50 hover:bg-muted text-foreground"
                        )}
                      >
                        <item.icon className="h-6 w-6 mb-1.5" />
                        <span className="text-xs font-medium text-center leading-tight">{item.title}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Footer actions */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-background space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSheetOpen(false);
                  navigate("/");
                }}
                className="w-full justify-start"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Zurück zur Website
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Abmelden
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
