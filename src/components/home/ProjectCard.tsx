import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { CardImage } from "@/components/Picture";

interface Project {
  title: string;
  category: string;
  image: string;
  tags: string[];
  link?: string;
}

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const cardContent = (
    <Card className="glass-card group hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 overflow-hidden touch-manipulation cursor-pointer h-full border-2 border-transparent hover:border-primary/30">
      <div className="relative overflow-hidden aspect-[16/10]">
        <CardImage 
          src={project.image} 
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
        
        {/* Category Badge */}
        <Badge className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-white/95 text-primary text-[10px] sm:text-xs px-2.5 py-1 font-semibold shadow-lg">
          {project.category}
        </Badge>
        
        {/* External Link Icon - only show if has link */}
        {project.link && (
          <div className="absolute top-3 sm:top-4 right-3 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
        )}
        
        {/* Bottom Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-secondary transition-colors drop-shadow-lg">
            {project.title}
          </h3>
          
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {project.tags.map((tag) => (
              <Badge 
                key={tag} 
                className="bg-white/20 backdrop-blur-sm text-white border-white/30 text-[10px] sm:text-xs px-2 py-0.5 font-medium"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );

  if (project.link) {
    return (
      <a href={project.link} target="_blank" rel="noopener noreferrer" className="block h-full">
        {cardContent}
      </a>
    );
  }

  return cardContent;
}
