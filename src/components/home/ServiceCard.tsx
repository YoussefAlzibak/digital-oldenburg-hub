import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { CardImage } from "@/components/Picture";

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  image: string;
  link: string;
}

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const IconComponent = service.icon;
  
  return (
    <Card className="glass-card h-full group hover:scale-105 transition-all duration-300 overflow-hidden touch-manipulation">
      <div className="relative overflow-hidden">
        <CardImage 
          src={service.image} 
          alt={service.title}
          className="w-full h-36 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <IconComponent className="absolute top-3 sm:top-4 left-3 sm:left-4 h-6 w-6 sm:h-8 sm:w-8 text-white drop-shadow-lg" />
      </div>
      
      <CardContent className="p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold mb-2 group-hover:text-primary transition-colors">
          {service.title}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
          {service.description}
        </p>
        
        <Button size="sm" variant="ghost" className="w-full text-primary hover:bg-primary/10 text-xs sm:text-sm touch-manipulation" asChild>
          <Link to={service.link}>
            Mehr erfahren
            <ArrowRight className="ml-2 h-3 w-3" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
