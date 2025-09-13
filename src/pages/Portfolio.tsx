import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Globe, ExternalLink, Github } from "lucide-react";
import { Link } from "react-router-dom";
import portfolioCorporate from "@/assets/portfolio-corporate.webp";
import portfolioEcommerce from "@/assets/portfolio-ecommerce.webp";
import portfolioMobile from "@/assets/portfolio-mobile.webp";
import portfolioSaas from "@/assets/portfolio-saas.webp";
import portfolioSmarthome from "@/assets/portfolio-smarthome.webp";

const Portfolio = () => {
  const projects = [
    {
      id: 1,
      title: "Corporate Website",
      category: "Webdesign",
      description: "Moderne Unternehmenswebsite mit CMS-Anbindung und SEO-Optimierung",
      image: portfolioCorporate,
      tags: ["React", "TypeScript", "Tailwind CSS", "CMS"],
      featured: true
    },
    {
      id: 2,
      title: "E-Commerce Platform",
      category: "E-Commerce",
      description: "Vollständige Online-Shop-Lösung mit Payment-Integration",
      image: portfolioEcommerce,
      tags: ["Next.js", "Stripe", "Database", "Admin Panel"],
      featured: true
    },
    {
      id: 3,
      title: "Mobile App",
      category: "Mobile",
      description: "Cross-Platform App für iOS und Android",
      image: portfolioMobile,
      tags: ["React Native", "API Integration", "Push Notifications"],
      featured: false
    },
    {
      id: 4,
      title: "SaaS Dashboard",
      category: "Web App",
      description: "Analytics Dashboard mit Echtzeit-Datenvisualisierung",
      image: portfolioSaas,
      tags: ["React", "Charts", "Real-time", "API"],
      featured: true
    },
    {
      id: 5,
      title: "Smart Home App",
      category: "IoT",
      description: "Smart Home Steuerung mit IoT-Geräte Integration",
      image: portfolioSmarthome,
      tags: ["IoT", "Real-time", "Mobile App", "Cloud"],
      featured: false
    },
    {
      id: 6,
      title: "Portfolio Website",
      category: "Webdesign",
      description: "Kreative Portfolio-Website für einen Fotografen",
      image: portfolioCorporate,
      tags: ["Design", "Photography", "Responsive", "Gallery"],
      featured: false
    }
  ];

  const categories = ["Alle", "Webdesign", "E-Commerce", "Mobile", "Web App", "IoT"];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <div className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Digital Solutions
                </div>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">Home</Link>
              <Link to="/services" className="text-sm font-medium hover:text-primary transition-colors">Services</Link>
              <Link to="/portfolio" className="text-sm font-medium text-primary">Portfolio</Link>
              <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">Über uns</Link>
              <Link to="/contact" className="text-sm font-medium hover:text-primary transition-colors">Kontakt</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20">
              Unsere Arbeiten
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Portfolio &
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"> Projekte</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Entdecken Sie unsere erfolgreichen Projekte und lassen Sie sich von unserer Arbeit inspirieren
            </p>
          </div>
        </div>
      </section>

      {/* Filter Categories */}
      <section className="pb-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "Alle" ? "default" : "outline"}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="pb-12">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8 text-center">Featured Projects</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {projects.filter(p => p.featured).map((project) => (
              <Card key={project.id} className="group hover:shadow-2xl transition-all duration-500 bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden">
                <div className="relative overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="bg-background/80 backdrop-blur-sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Live Demo
                      </Button>
                      <Button size="sm" variant="outline" className="bg-background/80 backdrop-blur-sm">
                        <Github className="h-4 w-4 mr-2" />
                        Code
                      </Button>
                    </div>
                  </div>
                  <Badge className="absolute top-4 right-4 bg-primary/90 text-primary-foreground">
                    {project.category}
                  </Badge>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
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

      {/* All Projects */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8 text-center">Alle Projekte</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Card key={project.id} className="group hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden">
                <div className="relative overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <Badge className="absolute top-3 right-3 bg-primary/90 text-primary-foreground text-xs">
                    {project.category}
                  </Badge>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button size="sm" variant="ghost" className="w-full text-primary hover:bg-primary/10">
                    Details ansehen
                    <ArrowRight className="ml-2 h-3 w-3" />
                  </Button>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Gefällt Ihnen was Sie sehen?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Lassen Sie uns gemeinsam an Ihrem nächsten Projekt arbeiten. Wir bringen Ihre Ideen zum Leben.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/contact">
                  Projekt starten
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/services">Services ansehen</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;