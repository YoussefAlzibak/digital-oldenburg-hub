import { Button } from "@/components/ui/button";
import { Home, Briefcase, FolderOpen, Users, MessageCircle } from "lucide-react";
import { useLocation, Link } from "react-router-dom";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Briefcase, label: "Services", href: "/services" },
  { icon: FolderOpen, label: "Portfolio", href: "/portfolio" },
  { icon: Users, label: "About", href: "/about" },
  { icon: MessageCircle, label: "Contact", href: "/contact" },
];

export function WebsiteMobileNav() {
  const location = useLocation();
  
  // Only show on small screens and not on admin routes
  if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard')) {
    return null;
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-primary/95 to-primary-foreground/95 backdrop-blur-lg border-t border-primary/20 z-[9999] shadow-2xl">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            size="sm"
            className={`flex-1 flex flex-col items-center justify-center h-full px-2 py-1 text-xs transition-all duration-300 ${
              isActive(item.href)
                ? 'text-white bg-white/20 shadow-lg'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
            asChild
          >
            <Link to={item.href}>
              <item.icon className={`h-5 w-5 mb-1 transition-transform duration-300 ${
                isActive(item.href) ? 'scale-110' : 'hover:scale-105'
              }`} />
              <span className="text-xs leading-tight font-medium">{item.label}</span>
            </Link>
          </Button>
        ))}
      </div>
    </nav>
  );
}