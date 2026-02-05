import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 400px
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <Button
      onClick={scrollToTop}
      size="icon"
      className={`
        fixed bottom-24 sm:bottom-8 right-4 sm:right-8 z-40
        h-12 w-12 rounded-full shadow-lg
        bg-primary hover:bg-primary/90 text-primary-foreground
        transition-all duration-300 ease-out
        ${isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-4 scale-75 pointer-events-none'
        }
        hover:scale-110 hover:shadow-xl
        active:scale-95
      `}
      aria-label="Nach oben scrollen"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
}
