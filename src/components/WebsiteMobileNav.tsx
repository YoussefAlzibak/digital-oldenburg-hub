import { 
  Home,
  Globe, 
  Monitor,
  Users2,
  MessageCircle,
  Calendar
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { title: "Home", url: "#hero", icon: Home },
  { title: "Services", url: "#services", icon: Globe },
  { title: "Portfolio", url: "#portfolio", icon: Monitor },
  { title: "Über uns", url: "#about", icon: Users2 },
  { title: "Kontakt", url: "#contact", icon: MessageCircle },
];

export function WebsiteMobileNav() {
  const location = useLocation();
  
  // Only show on main website (not admin routes)
  if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/auth')) {
    return null;
  }
  
  const scrollToSection = (url: string) => {
    if (url.startsWith('#')) {
      const element = document.querySelector(url);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = url;
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border z-[9999] shadow-lg">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => (
          <Button
            key={item.title}
            variant="ghost"
            onClick={() => scrollToSection(item.url)}
            className="flex flex-col items-center justify-center min-w-0 flex-1 px-1 py-2 rounded-lg h-auto text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium truncate max-w-full">{item.title}</span>
          </Button>
        ))}
        
        {/* CTA Button */}
        <Button
          onClick={() => scrollToSection('#contact')}
          className="flex flex-col items-center justify-center min-w-0 flex-1 px-1 py-2 rounded-lg h-auto bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Calendar className="h-5 w-5 mb-1" />
          <span className="text-xs font-medium">Termin</span>
        </Button>
      </div>
    </nav>
  );
}