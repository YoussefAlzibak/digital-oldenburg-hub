import { ReactNode } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface ScrollRevealProps {
  children: ReactNode;
  animation?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale-in' | 'fade-in';
  delay?: number;
  className?: string;
}

const animationClasses = {
  'fade-up': 'opacity-0 translate-y-10',
  'fade-down': 'opacity-0 -translate-y-10',
  'fade-left': 'opacity-0 translate-x-10',
  'fade-right': 'opacity-0 -translate-x-10',
  'scale-in': 'opacity-0 scale-95',
  'fade-in': 'opacity-0',
};

const visibleClasses = {
  'fade-up': 'opacity-100 translate-y-0',
  'fade-down': 'opacity-100 translate-y-0',
  'fade-left': 'opacity-100 translate-x-0',
  'fade-right': 'opacity-100 translate-x-0',
  'scale-in': 'opacity-100 scale-100',
  'fade-in': 'opacity-100',
};

export function ScrollReveal({ 
  children, 
  animation = 'fade-up', 
  delay = 0,
  className = ''
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`
        transition-all duration-700 ease-out
        ${animationClasses[animation]}
        ${isVisible ? visibleClasses[animation] : ''}
        ${className}
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
