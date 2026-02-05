import { Link } from "react-router-dom";
import { ScrollReveal } from "@/components/ScrollReveal";
import NewsletterSignup from "@/components/NewsletterSignup";
import { 
  Instagram, 
  Facebook, 
  Linkedin, 
  Github,
  Mail,
  Phone,
  MapPin
} from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-20 bg-gradient-to-br from-[hsl(var(--primary))] via-[hsl(230,100%,25%)] to-[hsl(var(--primary))] overflow-hidden w-full">
      {/* Animated Background */}
      <div className="absolute inset-0 w-full">
        <div className="absolute top-20 left-20 w-64 sm:w-96 h-64 sm:h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute bottom-20 right-20 w-64 sm:w-96 h-64 sm:h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10 max-w-7xl w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-8 sm:mb-12">
          {/* Company Info */}
          <ScrollReveal animation="fade-up">
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Unicum Tech</h3>
              <p className="text-white/80 text-xs sm:text-sm italic mb-3 sm:mb-4">
                Everything for web services
              </p>
              <div className="space-y-2 sm:space-y-3 text-white/70 text-xs sm:text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mt-1 flex-shrink-0" />
                  <div>
                    <p>Hirschberger Straße 30</p>
                    <p>26135 Oldenburg</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <a href="mailto:info@unicum-tech.com" className="hover:text-white transition-colors break-all">
                    info@unicum-tech.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <a href="tel:+4917066668089" className="hover:text-white transition-colors">
                    0170 6666809
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Navigation */}
          <ScrollReveal animation="fade-up" delay={100}>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Navigation</h3>
              <ul className="space-y-1.5 sm:space-y-2 text-white/70 text-xs sm:text-sm">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/services" className="hover:text-white transition-colors">Services</Link></li>
                <li><Link to="/portfolio" className="hover:text-white transition-colors">Portfolio</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">Über uns</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Kontakt</Link></li>
              </ul>
            </div>
          </ScrollReveal>

          {/* Newsletter */}
          <ScrollReveal animation="fade-up" delay={200}>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Newsletter</h3>
              <p className="text-white/70 text-xs sm:text-sm mb-3 sm:mb-4">
                Bleiben Sie auf dem Laufenden mit unseren neuesten Web-Lösungen!
              </p>
              <div className="newsletter-wrapper [&_.card]:bg-white/5 [&_.card]:backdrop-blur-md [&_.card]:border-white/10 [&_.card-header]:hidden [&_input]:bg-white/10 [&_input]:border-white/20 [&_input]:text-white [&_input]:placeholder:text-white/50 [&_input]:text-xs [&_input]:sm:text-sm [&_button]:w-full [&_button]:bg-secondary [&_button]:text-secondary-foreground [&_button]:hover:bg-secondary/90 [&_button]:text-xs [&_button]:sm:text-sm">
                <NewsletterSignup />
              </div>
            </div>
          </ScrollReveal>

          {/* Social Media */}
          <ScrollReveal animation="fade-up" delay={300}>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Folgen Sie uns</h3>
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
                <a 
                  href="https://www.instagram.com/unicumtech/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110 active:scale-95"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
                </a>
                <a 
                  href="#" 
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110 active:scale-95"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
                </a>
                <a 
                  href="#" 
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110 active:scale-95"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />
                </a>
                <a 
                  href="#" 
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110 active:scale-95"
                  aria-label="GitHub"
                >
                  <Github className="h-4 w-4 sm:h-5 sm:w-5" />
                </a>
              </div>

              <h4 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">Zahlungsmethoden</h4>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-white/70">
                <span className="px-2 sm:px-3 py-1 bg-white/10 rounded-full">PayPal</span>
                <span className="px-2 sm:px-3 py-1 bg-white/10 rounded-full">Kreditkarte</span>
                <span className="px-2 sm:px-3 py-1 bg-white/10 rounded-full">Klarna</span>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Footer Bottom */}
        <div className="pt-6 sm:pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-white/60 text-xs sm:text-sm text-center">
            <p>© 2025 Unicum Tech. Alle Rechte vorbehalten.</p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <Link to="/imprint" className="hover:text-white transition-colors">Impressum</Link>
              <Link to="/privacy" className="hover:text-white transition-colors">Datenschutz</Link>
              <Link to="/terms" className="hover:text-white transition-colors">AGB</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
