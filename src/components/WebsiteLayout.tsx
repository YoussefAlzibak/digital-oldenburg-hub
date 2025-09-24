import { Link, useLocation } from "react-router-dom";
import { WebsiteMobileNav } from "@/components/WebsiteMobileNav";
import { 
  Home,
  Globe,
  Monitor,
  Users2,
  MessageCircle,
  Palette
} from "lucide-react";

interface WebsiteLayoutProps {
  children: React.ReactNode;
}

export function WebsiteLayout({ children }: WebsiteLayoutProps) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Header with Navigation */}
      <header className="header-enhanced sticky top-0 z-50 bg-gradient-to-r from-primary/95 to-primary-foreground/95 backdrop-blur-lg shadow-2xl border-b border-primary/20">
        <div className="header-geometric-bg">
          <div className="header-shape header-hexagon-1 animate-float" style={{animationDelay: '0s'}}></div>
          <div className="header-shape header-triangle-1 animate-float" style={{animationDelay: '0.5s'}}></div>
          <div className="header-shape header-diamond-1 animate-float" style={{animationDelay: '1s'}}></div>
          <div className="header-shape header-circle-1 animate-float" style={{animationDelay: '1.5s'}}></div>
          <div className="header-shape header-square-1 animate-float" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 py-4 md:py-5 relative z-10">
          <div className="flex items-center justify-between">
            {/* Enhanced Logo */}
            <Link to="/" className="flex items-center space-x-3 md:space-x-4 animate-fade-left group">
              <div className="logo-container">
                <div className="logo-geometric group-hover:scale-110 transition-transform duration-300">
                  <div className="logo-primary-shape animate-pulse"></div>
                  <div className="logo-accent-shape"></div>
                  <div className="logo-inner-detail animate-spin" style={{animationDuration: '20s'}}></div>
                </div>
              </div>
              <div className="logo-text">
                <span className="text-2xl md:text-3xl font-black text-[hsl(var(--brand-secondary))] tracking-tight group-hover:text-accent transition-colors duration-300">Unicum</span>
                <span className="text-2xl md:text-3xl font-light text-[hsl(var(--brand-primary))] tracking-tight">Tec</span>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-widest mt-1 group-hover:text-white transition-colors duration-300">Digital Excellence</div>
              </div>
            </Link>

            {/* Enhanced Tablet Navigation */}
            <nav className="hidden md:flex lg:hidden items-center space-x-4">
              <Link 
                to="/services" 
                className={`nav-link group flex items-center px-3 py-2 font-medium transition-all duration-300 hover:bg-white/10 rounded-lg ${
                  isActive('/services') ? 'text-white bg-white/20' : 'text-white/90 hover:text-white'
                }`}
              >
                <Palette className="nav-icon h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                <span className="relative">
                  Services
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </span>
              </Link>
              <Link 
                to="/portfolio" 
                className={`nav-link group flex items-center px-3 py-2 font-medium transition-all duration-300 hover:bg-white/10 rounded-lg ${
                  isActive('/portfolio') ? 'text-white bg-white/20' : 'text-white/90 hover:text-white'
                }`}
              >
                <Monitor className="nav-icon h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                <span className="relative">
                  Portfolio
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </span>
              </Link>
              <Link 
                to="/about" 
                className={`nav-link group flex items-center px-3 py-2 font-medium transition-all duration-300 hover:bg-white/10 rounded-lg ${
                  isActive('/about') ? 'text-white bg-white/20' : 'text-white/90 hover:text-white'
                }`}
              >
                <Users2 className="nav-icon h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                <span className="relative">
                  Über uns
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </span>
              </Link>
              <Link 
                to="/contact" 
                className="cta-button group bg-accent hover:bg-accent/90 text-primary font-semibold px-4 py-2 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-accent/25 hover:scale-105"
              >
                <MessageCircle className="h-4 w-4 mr-2 group-hover:animate-pulse" />
                Kontakt
              </Link>
            </nav>
            
            {/* Enhanced Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1 animate-fade-right">
              <Link 
                to="/" 
                className={`nav-link group flex items-center px-4 py-2 font-medium transition-all duration-300 hover:bg-white/10 rounded-lg ${
                  isActive('/') ? 'text-white bg-white/20' : 'text-white/90 hover:text-white'
                }`}
              >
                <Home className="nav-icon w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                <span className="relative">
                  Home
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </span>
              </Link>
              <Link 
                to="/services" 
                className={`nav-link group flex items-center px-4 py-2 font-medium transition-all duration-300 hover:bg-white/10 rounded-lg ${
                  isActive('/services') ? 'text-white bg-white/20' : 'text-white/90 hover:text-white'
                }`}
              >
                <Globe className="nav-icon w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                <span className="relative">
                  Services
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </span>
              </Link>
              <Link 
                to="/portfolio" 
                className={`nav-link group flex items-center px-4 py-2 font-medium transition-all duration-300 hover:bg-white/10 rounded-lg ${
                  isActive('/portfolio') ? 'text-white bg-white/20' : 'text-white/90 hover:text-white'
                }`}
              >
                <Monitor className="nav-icon w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                <span className="relative">
                  Portfolio
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </span>
              </Link>
              <Link 
                to="/about" 
                className={`nav-link group flex items-center px-4 py-2 font-medium transition-all duration-300 hover:bg-white/10 rounded-lg ${
                  isActive('/about') ? 'text-white bg-white/20' : 'text-white/90 hover:text-white'
                }`}
              >
                <Users2 className="nav-icon w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                <span className="relative">
                  Über uns
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </span>
              </Link>
              <Link 
                to="/contact" 
                className="cta-button group bg-accent hover:bg-accent/90 text-primary font-semibold px-5 py-2 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-accent/25 hover:scale-105"
              >
                <MessageCircle className="h-4 w-4 mr-2 group-hover:animate-pulse" />
                Kontakt
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20 sm:pb-0">
        {children}
      </main>

      {/* Mobile Navigation */}
      <WebsiteMobileNav />
    </div>
  );
}