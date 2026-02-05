import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/ScrollReveal";

interface SectionHeaderProps {
  badge: string;
  title: string;
  titleHighlight: string;
  description: string;
}

export function SectionHeader({ badge, title, titleHighlight, description }: SectionHeaderProps) {
  return (
    <div className="text-center mb-12 sm:mb-16">
      <ScrollReveal animation="fade-up">
        <Badge className="mb-3 sm:mb-4 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-primary/10 text-primary border-primary/20">
          {badge}
        </Badge>
      </ScrollReveal>
      <ScrollReveal animation="fade-left" delay={100}>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
          {title} <span className="text-primary">{titleHighlight}</span>
        </h2>
      </ScrollReveal>
      <ScrollReveal animation="fade-right" delay={200}>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          {description}
        </p>
      </ScrollReveal>
    </div>
  );
}
