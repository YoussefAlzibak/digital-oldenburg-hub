import { Globe, Users, Settings, Printer, Shield, Zap, Users2, Award, Rocket, TrendingUp } from "lucide-react";

// Import images
import webdesignService from "@/assets/webdesign-service.webp";
import crmService from "@/assets/crm-service.webp";
import itService from "@/assets/it-service.webp";
import printService from "@/assets/print-service.webp";
import portfolioProfileforge from "@/assets/portfolio-profileforge.webp";
import portfolioNailsalon from "@/assets/portfolio-nailsalon.webp";
import portfolioDiamondfinish from "@/assets/portfolio-diamondfinish.webp";
import portfolioProfach from "@/assets/portfolio-profach.webp";
import portfolioNouhHausservice from "@/assets/portfolio-nouh-hausservice.webp";

export const services = [
  {
    icon: Globe,
    title: "Webdesign & Development",
    description: "Moderne, responsive Websites mit fokussiertem UX/UI Design.",
    image: webdesignService,
    link: "/services"
  },
  {
    icon: Users,
    title: "CRM & HubSpot Solutions",
    description: "Professionelle CRM-Systeme und HubSpot-Integration für optimierte Kundenverwaltung.",
    image: crmService,
    link: "/services"
  },
  {
    icon: Settings,
    title: "IT-Services & Smart Home",
    description: "Umfassende IT-Betreuung und moderne Smart Home Lösungen.",
    image: itService,
    link: "/services"
  },
  {
    icon: Printer,
    title: "Print Design & Branding",
    description: "Professionelle Print-Materialien und Corporate Identity Design.",
    image: printService,
    link: "/services"
  }
];

export const projects = [
  {
    title: "CV & Health Platform",
    category: "SaaS",
    image: portfolioProfileforge,
    tags: ["React", "TypeScript", "KI"],
    link: "https://profile-forge-share-1.onrender.com"
  },
  {
    title: "Nail Salon Hub",
    category: "Beauty",
    image: portfolioNailsalon,
    tags: ["React", "Booking", "Beauty"],
    link: "https://nail-salon-hub.onrender.com"
  },
  {
    title: "Diamond Finish",
    category: "Automotive",
    image: portfolioDiamondfinish,
    tags: ["React", "Automotive"],
    link: "https://diamond-finish.de"
  },
  {
    title: "ProFach International",
    category: "Business",
    image: portfolioProfach,
    tags: ["React", "Business"],
    link: "https://profach-international.com"
  },
  {
    title: "Nouh Hausservice",
    category: "Service",
    image: portfolioNouhHausservice,
    tags: ["React", "Hausservice"],
    link: "https://nouh-hausservice.de"
  }
];

export const stats = [
  { number: "150+", label: "Erfolgreiche Projekte", icon: Rocket },
  { number: "98%", label: "Kundenzufriedenheit", icon: Award },
  { number: "5+", label: "Jahre Erfahrung", icon: TrendingUp }
];

export const benefits = [
  {
    icon: Zap,
    title: "Schnelle Umsetzung",
    description: "Effiziente Prozesse für schnelle Projektumsetzung"
  },
  {
    icon: Shield,
    title: "Höchste Sicherheit",
    description: "Modernste Sicherheitsstandards für Ihre Daten"
  },
  {
    icon: Users2,
    title: "Persönlicher Support",
    description: "Direkter Ansprechpartner während des gesamten Projekts"
  },
  {
    icon: Award,
    title: "Beste Qualität",
    description: "Höchste Qualitätsstandards in jedem Detail"
  }
];
