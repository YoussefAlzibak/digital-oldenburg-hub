import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Globe, 
  Users, 
  Settings, 
  Printer, 
  Star, 
  ArrowRight, 
  CheckCircle,
  Shield,
  Clock,
  Monitor,
  Smartphone,
  Zap,
  Award,
  Mail,
  Phone,
  MapPin
} from "lucide-react";
import { useState } from "react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("Alle");

  const services = [
    {
      icon: Globe,
      title: "Webdesign & Development",
      description: "Moderne, responsive Websites mit fokussiertem UX/UI Design. Von der Konzeption bis zur Umsetzung - wir schaffen digitale Erlebnisse, die begeistern.",
      features: [
        "Responsive & Mobile-First Design",
        "Performance & SEO-Optimierung", 
        "E-Commerce & Content Management"
      ]
    },
    {
      icon: Users,
      title: "CRM & HubSpot Solutions",
      description: "Professionelle CRM-Systeme und HubSpot-Integration für optimierte Kundenverwaltung, Marketing-Automatisierung und datengetriebene Geschäftsentscheidungen.",
      features: [
        "HubSpot Setup & Customization",
        "Marketing Automation & Lead-Nurturing",
        "Sales Pipeline & Analytics"
      ]
    },
    {
      icon: Settings,
      title: "IT-Services & Smart Home",
      description: "Umfassende IT-Betreuung und moderne Smart Home Lösungen. Von Netzwerk-Setup bis hin zu intelligenten Automatisierungssystemen für Ihr Zuhause oder Büro.",
      features: [
        "IT-Support & Systemadministration",
        "Smart Home Automation",
        "Sicherheitssysteme & Monitoring"
      ]
    },
    {
      icon: Printer,
      title: "Print Design & Branding",
      description: "Professionelle Print-Materialien und Corporate Identity Design für einen einheitlichen und professionellen Markenauftritt.",
      features: [
        "Logo & Corporate Design",
        "Visitenkarten & Briefpapier",
        "Broschüren & Marketing-Materialien"
      ]
    }
  ];

  const projects = [
    {
      title: "E-Commerce Dashboard",
      description: "Vollständige CRM-Integration für Online-Shop mit automatisierten Workflows und Analytics.",
      category: "E-Commerce",
      tags: ["React", "Node.js", "CRM"],
      image: "/placeholder.svg"
    },
    {
      title: "Corporate Website",
      description: "Moderne Corporate Website mit integriertem Lead-Management-System.",
      category: "Corporate", 
      tags: ["HTML5", "CSS3", "JavaScript"],
      image: "/placeholder.svg"
    },
    {
      title: "SaaS Platform",
      description: "Benutzerfreundliches Dashboard für SaaS-Anwendung mit erweiterten CRM-Features.",
      category: "SaaS",
      tags: ["Vue.js", "API", "Analytics"],
      image: "/placeholder.svg"
    }
  ];

  const testimonials = [
    {
      name: "Markus Hansen",
      role: "Inhaber, Hansen Metallbau Oldenburg",
      initials: "MH",
      text: "Endlich eine moderne Website! Unicum Tec hat verstanden, was unser Handwerksbetrieb braucht. Mehr Anfragen und eine professionelle Online-Präsenz."
    },
    {
      name: "Dr. Sarah Weber",
      role: "Zahnärztin, Praxis Weber Oldenburg",
      initials: "SW", 
      text: "Schnelle Umsetzung und faire Preise. Unsere Praxis-Website ist genau das, was wir uns vorgestellt haben. Patienten finden uns jetzt viel besser online."
    },
    {
      name: "Robert Meyer",
      role: "Marketing Director, Digital Pioneers",
      initials: "RM",
      text: "Die HubSpot-Integration durch Unicum Tec war ein Game-Changer für unser Marketing. Lead-Generierung funktioniert jetzt automatisch und unsere Conversion-Rate hat sich verdreifacht."
    }
  ];

  const blogPosts = [
    {
      category: "Webdesign",
      date: "15. Januar 2024",
      title: "Die Zukunft des Webdesigns: Trends 2024",
      excerpt: "Entdecken Sie die neuesten Webdesign-Trends für 2024: Von Glasmorphismus bis hin zu KI-gestützten Designprozessen.",
      readTime: "5 Min. Lesezeit"
    },
    {
      category: "CRM",
      date: "10. Januar 2024", 
      title: "HubSpot Automatisierung: Effizienz steigern",
      excerpt: "Wie Sie mit intelligenten HubSpot-Workflows Ihre Marketing- und Sales-Prozesse automatisieren.",
      readTime: "7 Min. Lesezeit"
    },
    {
      category: "Smart Home",
      date: "5. Januar 2024",
      title: "Smart Home 2024: Intelligente Automation", 
      excerpt: "Die neuesten Smart Home Trends: Von sprachgesteuerter Beleuchtung bis zur KI-basierten Sicherheit.",
      readTime: "6 Min. Lesezeit"
    }
  ];

  const stats = [
    { number: "150+", label: "Erfolgreiche Projekte" },
    { number: "98%", label: "Kundenzufriedenheit" },
    { number: "5+", label: "Jahre Erfahrung" }
  ];

  const guarantees = [
    { icon: Shield, label: "ISO 27001", description: "Zertifizierte Informationssicherheit" },
    { icon: CheckCircle, label: "DSGVO", description: "100% Datenschutz-konform" },
    { icon: Clock, label: "24/7 Support", description: "Rund um die Uhr für Sie da" },
    { icon: Award, label: "Geld-zurück", description: "30 Tage Garantie" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-r from-[hsl(var(--brand-primary))] to-[hsl(var(--brand-secondary))] rounded-lg"></div>
              <span className="text-xl font-bold">Unicum Tec</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#services" className="text-muted-foreground hover:text-foreground transition-colors">Services</a>
              <a href="#portfolio" className="text-muted-foreground hover:text-foreground transition-colors">Portfolio</a>
              <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">Über uns</a>
              <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">Kontakt</a>
              <Button>Beratung anfragen</Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-[hsl(var(--brand-primary)/0.05)] to-[hsl(var(--brand-secondary)/0.05)]">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[hsl(var(--brand-primary))] to-[hsl(var(--brand-secondary))] bg-clip-text text-transparent">
            Full-Service Digitalagentur
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Unicum Tec - Ihre Full-Service Digitalagentur in Oldenburg. Wir transformieren Ihre Geschäftsprozesse durch innovative Webdesign-Lösungen, professionelle CRM-Systeme und modernste IT-Services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-[hsl(var(--brand-primary))] to-[hsl(var(--brand-secondary))] text-white">
              Unsere Projekte
            </Button>
            <Button variant="outline" size="lg">
              Beratung anfragen
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Unsere Services</h2>
            <p className="text-xl text-muted-foreground">Full-Service Lösungen für Ihre digitale Transformation</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-background to-muted/20">
                <CardHeader className="pb-4">
                  <div className="h-12 w-12 bg-gradient-to-r from-[hsl(var(--brand-primary))] to-[hsl(var(--brand-secondary))] rounded-lg flex items-center justify-center mb-4">
                    <service.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-[hsl(var(--brand-primary))]" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Unser Portfolio</h2>
            <p className="text-xl text-muted-foreground mb-8">Erfolgreiche Projekte aus Webdesign, CRM-Integration und IT-Services</p>
            
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {["Alle", "E-Commerce", "Corporate", "SaaS"].map((tab) => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? "default" : "outline"}
                  onClick={() => setActiveTab(tab)}
                  className="rounded-full"
                >
                  {tab}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects
              .filter(project => activeTab === "Alle" || project.category === activeTab)
              .map((project, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="aspect-video bg-gradient-to-br from-[hsl(var(--brand-primary)/0.1)] to-[hsl(var(--brand-secondary)/0.1)] flex items-center justify-center">
                    <Monitor className="h-12 w-12 text-[hsl(var(--brand-primary))]" />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <Badge variant="secondary">{project.category}</Badge>
                    </div>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Was unsere Kunden sagen</h2>
            <p className="text-xl text-muted-foreground">Echtes Feedback von zufriedenen Kunden aus Oldenburg und Umgebung</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 bg-gradient-to-r from-[hsl(var(--brand-primary))] to-[hsl(var(--brand-secondary))] rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.initials}
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <blockquote className="text-muted-foreground italic">
                    "{testimonial.text}"
                  </blockquote>
                  <div className="flex mt-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[hsl(var(--brand-accent))] text-[hsl(var(--brand-accent))]" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Unser Blog</h2>
            <p className="text-xl text-muted-foreground">Aktuelle Insights, Trends und Best Practices aus der digitalen Welt</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="aspect-video bg-gradient-to-br from-[hsl(var(--brand-primary)/0.1)] to-[hsl(var(--brand-secondary)/0.1)] flex items-center justify-center">
                  <Globe className="h-12 w-12 text-[hsl(var(--brand-primary))]" />
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{post.category}</Badge>
                    <span className="text-sm text-muted-foreground">{post.date}</span>
                  </div>
                  <CardTitle className="text-lg hover:text-[hsl(var(--brand-primary))] transition-colors cursor-pointer">
                    {post.title}
                  </CardTitle>
                  <CardDescription>{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{post.readTime}</span>
                    <Button variant="ghost" size="sm">
                      Weiterlesen <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="outline">Alle Artikel anzeigen</Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Über uns</h2>
              <p className="text-xl text-muted-foreground mb-6">
                Ihr Partner für digitalen Erfolg in Oldenburg
              </p>
              <p className="text-muted-foreground mb-8">
                Mit über 5 Jahren Erfahrung in der digitalen Welt verbinden wir kreatives Webdesign mit strategischem CRM-Management. Unsere Mission: Ihre Kundenkommunikation zu optimieren und messbare Ergebnisse zu erzielen.
              </p>
              <div className="grid grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-[hsl(var(--brand-primary))]">{stat.number}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">Webdesign</Badge>
                <Badge variant="secondary" className="w-fit">CRM-Integration</Badge>
                <Badge variant="secondary" className="w-fit">UI/UX Design</Badge>
              </div>
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">Marketing Automation</Badge>
                <Badge variant="secondary" className="w-fit">Data Analytics</Badge>
                <Badge variant="secondary" className="w-fit">API Development</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantees Section */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Vertrauen durch Qualität</h2>
            <p className="text-xl text-muted-foreground">Ihre Sicherheit ist unser Versprechen. Mit Zertifikaten, Garantien und transparenten Prozessen.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {guarantees.map((guarantee, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 bg-gradient-to-r from-[hsl(var(--brand-primary))] to-[hsl(var(--brand-secondary))] rounded-lg flex items-center justify-center mx-auto mb-4">
                    <guarantee.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">{guarantee.label}</h3>
                  <p className="text-sm text-muted-foreground">{guarantee.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Kontakt</h2>
            <p className="text-xl text-muted-foreground">Bereit für Ihr digitales Projekt? Lassen Sie uns sprechen!</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">Starten Sie Ihr Projekt</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Vorname" />
                  <Input placeholder="Nachname" />
                </div>
                <Input placeholder="E-Mail-Adresse" type="email" />
                <Input placeholder="Telefon" type="tel" />
                <Textarea placeholder="Beschreiben Sie Ihr Projekt..." className="h-32" />
                <Button className="w-full bg-gradient-to-r from-[hsl(var(--brand-primary))] to-[hsl(var(--brand-secondary))] text-white">
                  Anfrage senden
                </Button>
              </form>
            </div>
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-6">Kontaktinformationen</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-[hsl(var(--brand-primary))]" />
                    <span>Oldenburg, Niedersachsen</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-[hsl(var(--brand-primary))]" />
                    <span>info@unicumtec.de</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-[hsl(var(--brand-primary))]" />
                    <span>+49 (0) 441 XXX XXX</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Warum Unicum Tec?</h4>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--brand-primary))]" />
                    <span>Lokaler Partner in Oldenburg</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--brand-primary))]" />
                    <span>5+ Jahre Erfahrung</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--brand-primary))]" />
                    <span>98% Kundenzufriedenheit</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--brand-primary))]" />
                    <span>30 Tage Geld-zurück-Garantie</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 bg-gradient-to-r from-[hsl(var(--brand-primary))] to-[hsl(var(--brand-secondary))] rounded-lg"></div>
                <span className="text-xl font-bold">Unicum Tec</span>
              </div>
              <p className="text-background/70 mb-4">
                Ihre Full-Service Digitalagentur für Webdesign, CRM-Systeme und IT-Services in Oldenburg.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-background/70">
                <li>Webdesign & Development</li>
                <li>CRM & HubSpot Solutions</li>
                <li>IT-Services & Smart Home</li>
                <li>Print Design & Branding</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Unternehmen</h4>
              <ul className="space-y-2 text-background/70">
                <li>Über uns</li>
                <li>Portfolio</li>
                <li>Blog</li>
                <li>Karriere</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Kontakt</h4>
              <ul className="space-y-2 text-background/70">
                <li>Oldenburg, Niedersachsen</li>
                <li>info@unicumtec.de</li>
                <li>+49 (0) 441 XXX XXX</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-background/20 mt-8 pt-8 text-center text-background/70">
            <p>&copy; 2024 Unicum Tec. Alle Rechte vorbehalten. | Datenschutz | Impressum | AGB</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
