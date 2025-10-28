import { Link, useLocation } from "react-router-dom";
import { WebsiteMobileNav } from "@/components/WebsiteMobileNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Footer } from "@/components/Footer";
import { 
  Globe,
  Monitor,
  Users2,
  MessageCircle,
  Palette,
  Calendar,
  Shield
} from "lucide-react";

interface WebsiteLayoutProps {
  children: React.ReactNode;
}

export function WebsiteLayout({ children }: WebsiteLayoutProps) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background pb-24 sm:pb-0 overflow-x-hidden w-full max-w-[100vw]">
      {/* Enhanced Header with Geometric Figures */}
      <header className="header-enhanced fixed top-0 w-full z-50 touch-manipulation">
        <div className="header-geometric-bg">
          <div className="header-shape header-hexagon-1"></div>
          <div className="header-shape header-triangle-1"></div>
          <div className="header-shape header-diamond-1"></div>
          <div className="header-shape header-circle-1"></div>
          <div className="header-shape header-square-1"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-4 md:py-5 relative z-10 max-w-7xl w-full">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center space-x-3 sm:space-x-3 md:space-x-4 animate-fade-left">
              <div className="logo-container group scale-90 sm:scale-90 md:scale-100">
                <div className="logo-geometric">
                  <div className="logo-primary-shape"></div>
                  <div className="logo-accent-shape"></div>
                  <div className="logo-inner-detail"></div>
                </div>
              </div>
              <div className="logo-text">
                <div className="flex items-baseline">
                  <span className="text-xl sm:text-xl md:text-2xl lg:text-3xl font-black text-[hsl(var(--brand-secondary))] tracking-tight">Unicum</span>
                  <span className="text-xl sm:text-xl md:text-2xl lg:text-3xl font-light text-[hsl(var(--brand-primary))] tracking-tight">Tech</span>
                </div>
                <div className="text-[9px] sm:text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">Melyou</div>
              </div>
            </div>
            
            <nav className="hidden md:flex lg:hidden items-center space-x-4 md:space-x-6">
              <Link to="/" className={`text-xs md:text-sm font-medium transition-colors touch-manipulation ${
                isActive('/') ? 'text-primary' : 'text-foreground/80 hover:text-primary active:text-primary'
              }`}>
                Home
              </Link>
              <Link to="/services" className={`text-xs md:text-sm font-medium transition-colors touch-manipulation ${
                isActive('/services') ? 'text-primary' : 'text-foreground/80 hover:text-primary active:text-primary'
              }`}>
                Services
              </Link>
              <Link to="/portfolio" className={`text-xs md:text-sm font-medium transition-colors touch-manipulation ${
                isActive('/portfolio') ? 'text-primary' : 'text-foreground/80 hover:text-primary active:text-primary'
              }`}>
                Portfolio
              </Link>
              <Link to="/about" className={`text-xs md:text-sm font-medium transition-colors touch-manipulation ${
                isActive('/about') ? 'text-primary' : 'text-foreground/80 hover:text-primary active:text-primary'
              }`}>
                Über uns
              </Link>
              <Link to="/contact" className={`text-xs md:text-sm font-medium transition-colors touch-manipulation ${
                isActive('/contact') ? 'text-primary' : 'text-foreground/80 hover:text-primary active:text-primary'
              }`}>
                Kontakt
              </Link>
              <Link to="/auth" className="text-xs font-medium text-foreground/60 hover:text-primary transition-colors">
                Admin
              </Link>
              <ThemeToggle />
              <Link to="/contact" className="ml-4">
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                  <Calendar className="h-4 w-4 mr-2 inline" />
                  Termin
                </button>
              </Link>
            </nav>
            
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-10 animate-fade-right">
              <Link to="/" className={`nav-link text-sm touch-manipulation ${isActive('/') ? 'text-primary' : ''}`}>
                <Globe className="nav-icon h-4 w-4" />
                <span className="hidden xl:inline">Home</span>
              </Link>
              <Link to="/services" className={`nav-link text-sm touch-manipulation ${isActive('/services') ? 'text-primary' : ''}`}>
                <Palette className="nav-icon h-4 w-4" />
                <span className="hidden xl:inline">Services</span>
              </Link>
              <Link to="/portfolio" className={`nav-link text-sm touch-manipulation ${isActive('/portfolio') ? 'text-primary' : ''}`}>
                <Monitor className="nav-icon h-4 w-4" />
                <span className="hidden xl:inline">Portfolio</span>
              </Link>
              <Link to="/about" className={`nav-link text-sm touch-manipulation ${isActive('/about') ? 'text-primary' : ''}`}>
                <Users2 className="nav-icon h-4 w-4" />
                <span className="hidden xl:inline">Über uns</span>
              </Link>
              <Link to="/contact" className={`nav-link text-sm touch-manipulation ${isActive('/contact') ? 'text-primary' : ''}`}>
                <MessageCircle className="nav-icon h-4 w-4" />
                <span className="hidden xl:inline">Kontakt</span>
              </Link>
              <Link to="/auth" className="nav-link text-xs opacity-60 hover:opacity-100 touch-manipulation">
                <Shield className="nav-icon h-3 w-3" />
                <span className="hidden xl:inline">Admin</span>
              </Link>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-primary/5 border border-primary/10">
                <ThemeToggle />
              </div>
              <button className="cta-button group text-sm touch-manipulation">
                <Link to="/contact" className="flex items-center">
                  <Calendar className="h-3.5 w-3.5 lg:h-4 lg:w-4 mr-1.5 lg:mr-2 group-hover:rotate-12 transition-transform" />
                  <span className="hidden xl:inline">Beratung anfragen</span>
                  <span className="xl:hidden">Beratung</span>
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