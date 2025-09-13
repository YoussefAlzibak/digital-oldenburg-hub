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

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border z-[9999] shadow-lg">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            size="sm"
            className="flex-1 flex flex-col items-center justify-center h-full px-2 py-1 text-xs hover:bg-primary/10 hover:text-primary transition-colors"
            asChild
          >
            <Link to={item.href}>
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs leading-tight">{item.label}</span>
            </Link>
          </Button>
        ))}
      </div>
    </nav>
  );
}