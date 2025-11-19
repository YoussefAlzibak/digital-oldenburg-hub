import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ArrowRight, Heart, Lightbulb, Shield, Users, Target } from "lucide-react";
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
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <ScrollReveal animation="fade-up">
              <Badge className="mb-6 px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20">
                Über uns
              </Badge>
            </ScrollReveal>
            <div className="space-y-3">
              <ScrollReveal animation="fade-right" delay={100}>
                <h1 className="text-4xl md:text-6xl font-bold">
                  Wir sind
                </h1>
              </ScrollReveal>
              <ScrollReveal animation="fade-left" delay={250}>
                <span className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Digital Solutions
                </span>
              </ScrollReveal>
            </div>
            <ScrollReveal animation="fade-up" delay={400}>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed mt-6">
                Ein leidenschaftliches Team von Entwicklern, Designern und Strategen, die gemeinsam digitale Träume verwirklichen
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <ScrollReveal animation="fade-right">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Unsere Mission
                </h2>
              </ScrollReveal>
              <ScrollReveal animation="fade-left" delay={150}>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Wir glauben daran, dass jedes Unternehmen das Potenzial hat, digital zu glänzen. 
                  Unsere Mission ist es, innovative Technologien mit kreativem Design zu verbinden, 
                  um Lösungen zu schaffen, die nicht nur funktionieren, sondern begeistern.
                </p>
              </ScrollReveal>
              <ScrollReveal animation="fade-right" delay={300}>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Seit unserer Gründung haben wir über 150 Projekte erfolgreich umgesetzt und 
                  dabei immer den Menschen in den Mittelpunkt gestellt - sowohl unsere Kunden 
                  als auch die Nutzer ihrer digitalen Produkte.
                </p>
              </ScrollReveal>
              <ScrollReveal animation="fade-up" delay={450}>
                <Button size="lg" asChild>
                  <Link to="/contact">
                    Lassen Sie uns sprechen
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </ScrollReveal>
            </div>
            
            <ScrollReveal animation="scale-in" delay={200}>
              <div className="relative">
                <div className="glass-card p-2 rounded-3xl">
                  <img 
                    src={teamImage} 
                    alt="Unser Team"
                    className="rounded-2xl w-full h-96 object-cover"
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/30 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Unsere Erfolge in Zahlen</h2>
              <p className="text-xl text-muted-foreground">Was wir bisher erreicht haben</p>
            </div>
          </ScrollReveal>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <ScrollReveal key={index} animation="scale-in" delay={index * 100}>
                <div className="glass-card p-6 text-center group hover:scale-105 transition-all">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <ScrollReveal animation="fade-right">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Unsere Werte</h2>
            </ScrollReveal>
            <ScrollReveal animation="fade-left" delay={150}>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Diese Prinzipien leiten uns bei allem, was wir tun
              </p>
            </ScrollReveal>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <ScrollReveal key={index} animation="fade-up" delay={index * 100}>
                <Card className="glass-card group hover:scale-105 transition-all duration-300 text-center p-8">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-violet-500 to-purple-600 p-4 mb-4 group-hover:scale-110 transition-transform text-white flex items-center justify-center">
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <ScrollReveal animation="fade-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Unser Team</h2>
            </ScrollReveal>
            <ScrollReveal animation="fade-right" delay={150}>
              <p className="text-xl text-muted-foreground">
                Lernen Sie die Menschen hinter Digital Solutions kennen
              </p>
            </ScrollReveal>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <ScrollReveal key={index} animation="fade-up" delay={index * 150}>
                <Card className="glass-card group hover:scale-105 transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                    <p className="text-primary font-medium mb-3">{member.role}</p>
                    <p className="text-muted-foreground text-sm">{member.description}</p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '3s' }}></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <ScrollReveal animation="scale-in">
            <Target className="h-16 w-16 text-white mx-auto mb-6 animate-float" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Bereit für die Zusammenarbeit?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Werden Sie Teil unserer Erfolgsgeschichte. Lassen Sie uns gemeinsam Ihr nächstes digitales Projekt verwirklichen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-white text-violet-900 hover:bg-white/90 shadow-xl">
                <Link to="/contact">
                  Kostenlose Beratung
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="border-white/30 text-white hover:bg-white/10 backdrop-blur-md">
                <Link to="/portfolio">Unsere Arbeit</Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </WebsiteLayout>
  );
};

export default About;
