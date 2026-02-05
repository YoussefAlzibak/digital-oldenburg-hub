import { Card } from "@/components/ui/card";
import type { ElementType } from "react";

interface Benefit {
  icon: ElementType;
  title: string;
  description: string;
}

interface BenefitCardProps {
  benefit: Benefit;
}

export function BenefitCard({ benefit }: BenefitCardProps) {
  const IconComponent = benefit.icon;
  
  return (
    <Card className="glass-card p-4 sm:p-6 text-center group hover:scale-105 transition-all touch-manipulation">
      <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-primary-dark p-3 sm:p-4 mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
        <IconComponent className="w-full h-full text-white" />
      </div>
      <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1.5 sm:mb-2">{benefit.title}</h3>
      <p className="text-xs sm:text-sm text-muted-foreground">{benefit.description}</p>
    </Card>
  );
}
