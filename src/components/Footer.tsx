import { Link } from "react-router-dom";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter logic here
  };

  return (
    <footer className="relative mt-20 bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <ScrollReveal animation="fade-up">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white mb-4">Unicum Tech</h3>
              <p className="text-white/80 text-sm italic mb-4">
                Everything for web services
              </p>
              <div className="space-y-3 text-white/70 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                  <div>
                    <p>Hirschberger Straße 30</p>
                    <p>26135 Oldenburg</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <a href="mailto:info@unicum-tech.com" className="hover:text-white transition-colors">
                    info@unicum-tech.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <a href="tel:+491706666809" className="hover:text-white transition-colors">
                    +49 1706666809
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Navigation */}
          <ScrollReveal animation="fade-up" delay={100}>
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Navigation</h3>
              <ul className="space-y-2 text-white/70 text-sm">
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
              <h3 className="text-xl font-bold text-white mb-4">Newsletter</h3>
              <p className="text-white/70 text-sm mb-4">
                Bleiben Sie auf dem Laufenden mit unseren neuesten Web-Lösungen!
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <Input 
                  type="email" 
                  placeholder="Ihre E-Mail" 
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  required
                />
                <Button 
                  type="submit" 
                  className="w-full bg-white text-violet-900 hover:bg-white/90"
                >
                  Abonnieren
                </Button>
              </form>
            </div>
          </ScrollReveal>

          {/* Social Media */}
          <ScrollReveal animation="fade-up" delay={300}>
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Folgen Sie uns</h3>
              <div className="flex flex-wrap gap-3 mb-6">
                <a 
                  href="https://www.instagram.com/unicumtech/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
              </div>

              <h4 className="text-lg font-semibold text-white mb-3">Zahlungsmethoden</h4>
              <div className="flex flex-wrap gap-2 text-xs text-white/70">
                <span className="px-3 py-1 bg-white/10 rounded-full">PayPal</span>
                <span className="px-3 py-1 bg-white/10 rounded-full">Kreditkarte</span>
                <span className="px-3 py-1 bg-white/10 rounded-full">Klarna</span>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-white/60 text-sm">
            <p>© 2025 Unicum Tech. Alle Rechte vorbehalten.</p>
            <div className="flex gap-6">
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
