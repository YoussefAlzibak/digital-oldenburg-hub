import { Link, useLocation } from "react-router-dom";
import { WebsiteMobileNav } from "@/components/WebsiteMobileNav";
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
    <div className="min-h-screen bg-background pb-20 sm:pb-0">
      {/* Enhanced Header with Geometric Figures */}
      <header className="header-enhanced fixed top-0 w-full z-50">
        <div className="header-geometric-bg">
          <div className="header-shape header-hexagon-1"></div>
          <div className="header-shape header-triangle-1"></div>
          <div className="header-shape header-diamond-1"></div>
          <div className="header-shape header-circle-1"></div>
          <div className="header-shape header-square-1"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 py-4 md:py-5 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 md:space-x-4 animate-fade-left">
              <div className="logo-container group">
                <div className="logo-geometric">
                  <div className="logo-primary-shape"></div>
                  <div className="logo-accent-shape"></div>
                  <div className="logo-inner-detail"></div>
                </div>
              </div>
              <div className="logo-text">
                <span className="text-2xl md:text-3xl font-black text-[hsl(var(--brand-secondary))] tracking-tight">Unicum</span>
                <span className="text-2xl md:text-3xl font-light text-[hsl(var(--brand-primary))] tracking-tight">Tec</span>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-widest mt-1">Digital Excellence</div>
              </div>
            </div>
            
            <nav className="hidden md:flex lg:hidden items-center space-x-6">
              <Link to="/" className={`text-sm font-medium transition-colors ${
                isActive('/') ? 'text-primary' : 'text-foreground/80 hover:text-primary'
              }`}>
                Home
              </Link>
              <Link to="/services" className={`text-sm font-medium transition-colors ${
                isActive('/services') ? 'text-primary' : 'text-foreground/80 hover:text-primary'
              }`}>
                Services
              </Link>
              <Link to="/portfolio" className={`text-sm font-medium transition-colors ${
                isActive('/portfolio') ? 'text-primary' : 'text-foreground/80 hover:text-primary'
              }`}>
                Portfolio
              </Link>
              <Link to="/about" className={`text-sm font-medium transition-colors ${
                isActive('/about') ? 'text-primary' : 'text-foreground/80 hover:text-primary'
              }`}>
                Über uns
              </Link>
              <Link to="/contact" className={`text-sm font-medium transition-colors ${
                isActive('/contact') ? 'text-primary' : 'text-foreground/80 hover:text-primary'
              }`}>
                Kontakt
              </Link>
              <Link to="/auth" className="text-xs font-medium text-foreground/60 hover:text-primary transition-colors">
                Admin
              </Link>
              <Link to="/contact" className="ml-4">
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                  <Calendar className="h-4 w-4 mr-2 inline" />
                  Termin
                </button>
              </Link>
            </nav>
            
            <nav className="hidden lg:flex items-center space-x-10 animate-fade-right">
              <Link to="/" className={`nav-link ${isActive('/') ? 'text-primary' : ''}`}>
                <Globe className="nav-icon" />
                <span>Home</span>
              </Link>
              <Link to="/services" className={`nav-link ${isActive('/services') ? 'text-primary' : ''}`}>
                <Palette className="nav-icon" />
                <span>Services</span>
              </Link>
              <Link to="/portfolio" className={`nav-link ${isActive('/portfolio') ? 'text-primary' : ''}`}>
                <Monitor className="nav-icon" />
                <span>Portfolio</span>
              </Link>
              <Link to="/about" className={`nav-link ${isActive('/about') ? 'text-primary' : ''}`}>
                <Users2 className="nav-icon" />
                <span>Über uns</span>
              </Link>
              <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'text-primary' : ''}`}>
                <MessageCircle className="nav-icon" />
                <span>Kontakt</span>
              </Link>
              <Link to="/auth" className="nav-link text-xs opacity-60 hover:opacity-100">
                <Shield className="nav-icon h-3 w-3" />
                <span>Admin</span>
              </Link>
              <button className="cta-button group">
                <Link to="/contact">
                  <Calendar className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                  <span>Beratung anfragen</span>
                  <div className="cta-glow"></div>
                </Link>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24">
        {children}
      </main>

      {/* Mobile Navigation */}
      <WebsiteMobileNav />
    </div>
  );
}