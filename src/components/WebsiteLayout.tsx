import { Link, useLocation } from "react-router-dom";
import { WebsiteMobileNav } from "@/components/WebsiteMobileNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Footer } from "@/components/Footer";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import { PageTransition } from "@/components/PageTransition";
import { 
  Globe,
  Monitor,
  Users2,
  MessageCircle,
  Palette,
  Calendar
} from "lucide-react";
import logoImage from "@/assets/logo.png";

interface WebsiteLayoutProps {
  children: React.ReactNode;
}

export function WebsiteLayout({ children }: WebsiteLayoutProps) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background pb-24 sm:pb-0 overflow-x-hidden w-full max-w-[100vw]">
      {/* Enhanced Header */}
      <header className="header-enhanced fixed top-0 w-full z-50 touch-manipulation">
        <div className="container mx-auto px-4 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-4 md:py-5 relative z-10 max-w-7xl w-full">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            <Link to="/" className="flex items-center space-x-3 sm:space-x-3 md:space-x-4 animate-fade-left">
              <img 
                src={logoImage} 
                alt="Unicum Tech Logo" 
                className="h-12 sm:h-14 md:h-16 w-auto object-contain"
                loading="eager"
                decoding="sync"
              />
              <div className="logo-text">
                <div className="flex items-baseline">
                  <span className="text-xl sm:text-xl md:text-2xl lg:text-3xl font-black text-[hsl(var(--brand-secondary))] tracking-tight">Unicum</span>
                  <span className="text-xl sm:text-xl md:text-2xl lg:text-3xl font-light text-[hsl(var(--brand-primary))] tracking-tight">Tech</span>
                </div>
                <div className="text-[9px] sm:text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">Melyou</div>
              </div>
            </Link>
            
            <nav className="hidden md:flex lg:hidden items-center space-x-4 md:space-x-6">
              <Link to="/" className={`text-xs md:text-sm font-medium transition-colors touch-manipulation ${
                isActive('/') ? 'text-secondary font-semibold' : 'text-foreground hover:text-secondary active:text-secondary'
              }`}>
                Home
              </Link>
              <Link to="/services" className={`text-xs md:text-sm font-medium transition-colors touch-manipulation ${
                isActive('/services') ? 'text-secondary font-semibold' : 'text-foreground hover:text-secondary active:text-secondary'
              }`}>
                Services
              </Link>
              <Link to="/portfolio" className={`text-xs md:text-sm font-medium transition-colors touch-manipulation ${
                isActive('/portfolio') ? 'text-secondary font-semibold' : 'text-foreground hover:text-secondary active:text-secondary'
              }`}>
                Portfolio
              </Link>
              <Link to="/about" className={`text-xs md:text-sm font-medium transition-colors touch-manipulation ${
                isActive('/about') ? 'text-secondary font-semibold' : 'text-foreground hover:text-secondary active:text-secondary'
              }`}>
                Über uns
              </Link>
              <Link to="/contact" className={`text-xs md:text-sm font-medium transition-colors touch-manipulation ${
                isActive('/contact') ? 'text-secondary font-semibold' : 'text-foreground hover:text-secondary active:text-secondary'
              }`}>
                Kontakt
              </Link>
              {/* Admin Link intentionally hidden; access only via direct URL */}
              <ThemeToggle />
              <Link to="/book-appointment" className="ml-4">
                <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary/90 transition-colors">
                  <Calendar className="h-4 w-4 mr-2 inline" />
                  Termin
                </button>
              </Link>
            </nav>
            
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-10 animate-fade-right">
              <Link to="/" className={`nav-link text-sm touch-manipulation ${isActive('/') ? 'text-secondary' : ''}`}>
                <Globe className="nav-icon h-4 w-4" />
                <span className="hidden xl:inline">Home</span>
              </Link>
              <Link to="/services" className={`nav-link text-sm touch-manipulation ${isActive('/services') ? 'text-secondary' : ''}`}>
                <Palette className="nav-icon h-4 w-4" />
                <span className="hidden xl:inline">Services</span>
              </Link>
              <Link to="/portfolio" className={`nav-link text-sm touch-manipulation ${isActive('/portfolio') ? 'text-secondary' : ''}`}>
                <Monitor className="nav-icon h-4 w-4" />
                <span className="hidden xl:inline">Portfolio</span>
              </Link>
              <Link to="/about" className={`nav-link text-sm touch-manipulation ${isActive('/about') ? 'text-secondary' : ''}`}>
                <Users2 className="nav-icon h-4 w-4" />
                <span className="hidden xl:inline">Über uns</span>
              </Link>
              <Link to="/contact" className={`nav-link text-sm touch-manipulation ${isActive('/contact') ? 'text-secondary' : ''}`}>
                <MessageCircle className="nav-icon h-4 w-4" />
                <span className="hidden xl:inline">Kontakt</span>
              </Link>
              {/* Admin Link intentionally hidden; access only via direct URL */}
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-secondary/10 border border-secondary/20">
                <ThemeToggle />
              </div>
              <button className="cta-button group text-sm touch-manipulation">
                <Link to="/book-appointment" className="flex items-center">
                  <Calendar className="h-3.5 w-3.5 lg:h-4 lg:w-4 mr-1.5 lg:mr-2 group-hover:rotate-12 transition-transform" />
                  <span className="hidden xl:inline">Termin buchen</span>
                  <span className="xl:hidden">Termin</span>
                  <div className="cta-glow"></div>
                </Link>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 sm:pt-20 md:pt-24 w-full overflow-x-hidden">
        {children}
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Navigation */}
      <WebsiteMobileNav />
    </div>
  );
}