import {
import { 
  Home, 
  Briefcase, 
  FolderOpen, 
  Calendar, 
  MessageCircle,
  MoreHorizontal,
  Users,
  FileText,
  Shield,
  Star
} from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { useState } from "react";

const mainNavItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Briefcase, label: "Services", href: "/services" },
  { icon: FolderOpen, label: "Portfolio", href: "/portfolio" },
  { icon: Calendar, label: "Termin", href: "/book-appointment" },
];

const moreNavItems = [
  { icon: MessageCircle, label: "Kontakt", href: "/contact", section: "Seiten" },
  { icon: Users, label: "Über uns", href: "/about", section: "Seiten" },
  { icon: Star, label: "Bewertung abgeben", href: "/review", section: "Seiten" },
  { icon: FileText, label: "Impressum", href: "/imprint", section: "Rechtliches" },
  { icon: Shield, label: "Datenschutz", href: "/privacy", section: "Rechtliches" },
];

export function WebsiteMobileNav() {
  const location = useLocation();
  const [sheetOpen, setSheetOpen] = useState(false);
  
  // Only show on small screens and not on admin routes
  if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard')) {
    return null;
  }

  const isActive = (path: string) => location.pathname === path;
  const hasMoreItemActive = moreNavItems.some(item => isActive(item.href));

  // Group items by section
  const groupedItems = moreNavItems.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, typeof moreNavItems>);

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-primary/95 to-primary/85 backdrop-blur-lg border-t border-white/10 z-[9999] shadow-2xl">
      <div className="flex justify-around items-center h-16 px-1 pb-safe">
        {mainNavItems.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            className={cn(
              "flex-1 flex flex-col items-center justify-center h-full px-1 py-2 rounded-xl transition-all duration-300",
              isActive(item.href)
                ? "text-white bg-white/20"
                : "text-white/70 hover:text-white hover:bg-white/10"
            )}
          >
            <item.icon className={cn(
              "h-5 w-5 mb-0.5 transition-transform duration-300",
              isActive(item.href) && "scale-110"
            )} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        ))}
        
        {/* More menu with Sheet */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <button
              className={cn(
                "flex-1 flex flex-col items-center justify-center h-full px-1 py-2 rounded-xl transition-all duration-300",
                hasMoreItemActive
                  ? "text-white bg-white/20"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              )}
            >
              <MoreHorizontal className="h-5 w-5 mb-0.5" />
              <span className="text-[10px] font-medium">Mehr</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-auto max-h-[70vh] rounded-t-2xl">
            <SheetHeader className="pb-4">
              <SheetTitle className="text-left">Weitere Seiten</SheetTitle>
            </SheetHeader>
            
            <div className="space-y-6 pb-8">
              {Object.entries(groupedItems).map(([section, items]) => (
                <div key={section}>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
                    {section}
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {items.map((item) => (
                      <Link
                        key={item.label}
                        to={item.href}
                        onClick={() => setSheetOpen(false)}
                        className={cn(
                          "flex flex-col items-center justify-center p-4 rounded-xl transition-all active:scale-95",
                          isActive(item.href)
                            ? "bg-primary text-primary-foreground shadow-lg"
                            : "bg-muted/50 hover:bg-muted text-foreground"
                        )}
                      >
                        <item.icon className="h-6 w-6 mb-2" />
                        <span className="text-xs font-medium text-center leading-tight">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
