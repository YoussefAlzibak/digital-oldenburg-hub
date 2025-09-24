import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Globe, Users, Award, Target, Heart, Lightbulb, Shield, Zap, Monitor, Users2, MessageCircle, Calendar, Palette } from "lucide-react";
import { Link } from "react-router-dom";
import teamImage from "@/assets/team-image.webp";
import { WebsiteLayout } from "@/components/WebsiteLayout";

const About = () => {
  const values = [
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Passion",
      description: "Wir brennen für digitale Innovation und exzellente Lösungen"
    },
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: "Innovation",
      description: "Wir setzen auf neueste Technologien und kreative Ansätze"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Qualität",
      description: "Höchste Standards in Entwicklung, Design und Service"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Teamwork",
      description: "Zusammenarbeit und Kommunikation stehen im Mittelpunkt"
    }
  ];

  const stats = [
    { number: "150+", label: "Erfolgreiche Projekte" },
    { number: "50+", label: "Zufriedene Kunden" },
    { number: "5+", label: "Jahre Erfahrung" },
    { number: "24/7", label: "Support verfügbar" }
  ];

  const team = [
    {
      name: "Max Mustermann",
      role: "CEO & Frontend Developer",
      description: "Spezialist für moderne Web-Technologien und User Experience",
      image: teamImage
    },
    {
      name: "Anna Schmidt",
      role: "Backend Developer",
      description: "Expertin für skalierbare Architekturen und Cloud-Lösungen",
      image: teamImage
    },
    {
      name: "Tom Weber",
      role: "UI/UX Designer",
      description: "Kreativkopf für ansprechende und benutzerfreundliche Designs",
      image: teamImage
    }
  ];

  return (
    <WebsiteLayout>
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
              <Link to="/" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/services" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                Services
              </Link>
              <Link to="/portfolio" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                Portfolio
              </Link>
              <Link to="/about" className="text-sm font-medium text-primary">
                Über uns
              </Link>
              <Link to="/contact" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                Kontakt
              </Link>
              <Button size="sm" className="ml-4" asChild>
                <Link to="/contact">
                  <Calendar className="h-4 w-4 mr-2" />
                  Termin
                </Link>
              </Button>
            </nav>
            
            <nav className="hidden lg:flex items-center space-x-10 animate-fade-right">
              <Link to="/" className="nav-link">
                <Globe className="nav-icon" />
                <span>Home</span>
              </Link>
              <Link to="/services" className="nav-link">
                <Palette className="nav-icon" />
                <span>Services</span>
              </Link>
              <Link to="/portfolio" className="nav-link">
                <Monitor className="nav-icon" />
                <span>Portfolio</span>
              </Link>
              <Link to="/about" className="nav-link text-primary">
                <Users2 className="nav-icon" />
                <span>Über uns</span>
              </Link>
              <Link to="/contact" className="nav-link">
                <MessageCircle className="nav-icon" />
                <span>Kontakt</span>
              </Link>
              <Link to="/auth" className="nav-link text-xs opacity-60 hover:opacity-100">
                <Shield className="nav-icon h-3 w-3" />
                <span>Admin</span>
              </Link>
              <Button className="cta-button group" asChild>
                <Link to="/contact">
                  <Calendar className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                  <span>Beratung anfragen</span>
                  <div className="cta-glow"></div>
                </Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20">
              Über uns
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Wir sind
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"> Digital Solutions</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Ein leidenschaftliches Team von Entwicklern, Designern und Strategen, die gemeinsam digitale Träume verwirklichen
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Unsere Mission
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Wir glauben daran, dass jedes Unternehmen das Potenzial hat, digital zu glänzen. 
                Unsere Mission ist es, innovative Technologien mit kreativem Design zu verbinden, 
                um Lösungen zu schaffen, die nicht nur funktionieren, sondern begeistern.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Seit unserer Gründung haben wir über 150 Projekte erfolgreich umgesetzt und 
                dabei immer den Menschen in den Mittelpunkt gestellt - sowohl unsere Kunden 
                als auch die Nutzer ihrer digitalen Produkte.
              </p>
              <Button size="lg" asChild>
                <Link to="/contact">
                  Lassen Sie uns sprechen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-3xl transform rotate-3"></div>
              <img 
                src={teamImage} 
                alt="Unser Team"
                className="relative rounded-3xl shadow-2xl w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Unsere Erfolge in Zahlen</h2>
            <p className="text-xl text-muted-foreground">Was wir bisher erreicht haben</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Unsere Werte</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Diese Prinzipien leiten uns bei allem, was wir tun
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/50 text-center p-8">
                <CardContent className="p-0">
                  <div className="text-primary mb-4 flex justify-center">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Unser Team</h2>
            <p className="text-xl text-muted-foreground">
              Lernen Sie die Menschen hinter Digital Solutions kennen
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden">
                <div className="relative">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl p-12">
            <Target className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Bereit für die Zusammenarbeit?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Werden Sie Teil unserer Erfolgsgeschichte. Lassen Sie uns gemeinsam Ihr nächstes digitales Projekt verwirklichen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/contact">
                  Kostenlose Beratung
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/portfolio">Unsere Arbeit</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <WebsiteMobileNav />
    </div>
  );
};

export default About;