import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/ScrollReveal";
import { HeroImage, CardImage } from "@/components/Picture";
import { ArrowRight, ExternalLink, Github } from "lucide-react";
import { Link } from "react-router-dom";
import portfolioCorporate from "@/assets/portfolio-corporate.webp";
import portfolioEcommerce from "@/assets/portfolio-ecommerce.webp";
import portfolioMobile from "@/assets/portfolio-mobile.webp";
import portfolioSaas from "@/assets/portfolio-saas.webp";
import portfolioSmarthome from "@/assets/portfolio-smarthome.webp";
import portfolioProfileforge from "@/assets/portfolio-profileforge.webp";
import heroPortfolio from "@/assets/hero-portfolio.webp";
import { WebsiteLayout } from "@/components/WebsiteLayout";

const Portfolio = () => {
  const projects: { id: number; title: string; category: string; description: string; image: string; tags: string[]; featured: boolean; link?: string }[] = [
    {
      id: 1,
      title: "CV & Health Platform",
      category: "SaaS",
      description: "All-in-One Plattform für CV-Erstellung, Gesundheitsdaten und sicheren Notfallzugriff mit KI-Unterstützung",
      image: portfolioProfileforge,
      tags: ["React", "TypeScript", "KI", "DSGVO"],
      featured: true,
      link: "https://profile-forge-share-1.onrender.com"
    }
  ];

  const categories = ["Alle", "Webdesign", "E-Commerce", "Mobile", "Web App", "IoT"];
  
  return (
    <WebsiteLayout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <HeroImage 
            src={heroPortfolio} 
            alt="Portfolio Projects" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <ScrollReveal animation="fade-up">
              <Badge className="mb-6 px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20">
                Unsere Arbeiten
              </Badge>
            </ScrollReveal>
            <div className="space-y-3">
              <ScrollReveal animation="fade-right" delay={100}>
                <h1 className="text-4xl md:text-6xl font-bold">
                  Portfolio &
                </h1>
              </ScrollReveal>
              <ScrollReveal animation="fade-left" delay={250}>
                <span className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Projekte
                </span>
              </ScrollReveal>
            </div>
            <ScrollReveal animation="fade-up" delay={400}>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed mt-6">
                Entdecken Sie unsere erfolgreichen Projekte und lassen Sie sich von unserer Arbeit inspirieren
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Filter Categories */}
      <section className="pb-12">
        <div className="container mx-auto px-6">
          <ScrollReveal animation="fade-up">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category, index) => (
                <Button
                  key={category}
                  variant={category === "Alle" ? "default" : "outline"}
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="pb-12">
        <div className="container mx-auto px-6">
          <ScrollReveal animation="fade-right">
            <h2 className="text-2xl font-bold mb-8 text-center">Featured Projects</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {projects.filter(p => p.featured).map((project, index) => (
              <ScrollReveal key={project.id} animation="fade-up" delay={index * 150}>
                {project.link ? (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="block">
                    <Card className="glass-card group hover:scale-105 transition-all duration-500 overflow-hidden cursor-pointer">
                      <div className="relative overflow-hidden">
                        <CardImage 
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
                  </a>
                ) : (
                  <Card className="glass-card group hover:scale-105 transition-all duration-500 overflow-hidden">
                    <div className="relative overflow-hidden">
                      <CardImage 
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
                )}
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* All Projects */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <ScrollReveal animation="fade-left">
            <h2 className="text-2xl font-bold mb-8 text-center">Alle Projekte</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ScrollReveal key={project.id} animation="fade-up" delay={index * 100}>
                <Card className="glass-card group hover:scale-105 transition-all duration-300 overflow-hidden">
                  <div className="relative overflow-hidden">
                    <CardImage 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
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
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-br from-[hsl(var(--primary))] via-[hsl(230,100%,25%)] to-[hsl(var(--primary))]">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '3s' }}></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <ScrollReveal animation="scale-in">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Gefällt Ihnen was Sie sehen?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Lassen Sie uns gemeinsam an Ihrem nächsten Projekt arbeiten. Wir bringen Ihre Ideen zum Leben.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-xl">
                <Link to="/contact">
                  Projekt starten
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="border-white/30 text-white hover:bg-white/10 backdrop-blur-md">
                <Link to="/services">Services ansehen</Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </WebsiteLayout>
  );
};

export default Portfolio;
