import { useState } from 'react';
import { cn } from '@/lib/utils';

interface PictureProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  sizes?: string;
}

/**
 * Optimized Picture component with WebP support and lazy loading
 * Automatically handles WebP format with fallback for older browsers
 */
export function Picture({
  src,
  alt,
  className,
  loading = 'lazy',
  priority = false,
  sizes = '100vw'
}: PictureProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Determine the effective loading strategy
  const effectiveLoading = priority ? 'eager' : loading;
  
  // Get file extension and base path
  const isWebP = src.endsWith('.webp');
  const basePath = src.replace(/\.(webp|jpg|jpeg|png|gif)$/i, '');
  
  // Generate fallback path (assume jpg fallback for webp)
  const fallbackSrc = isWebP ? `${basePath}.jpg` : src;

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  return (
    <picture className={cn('block', !isLoaded && 'bg-muted animate-pulse')}>
      {/* WebP source for modern browsers */}
      {isWebP && (
        <source 
          srcSet={src} 
          type="image/webp"
          sizes={sizes}
        />
      )}
      
      {/* Fallback image */}
      <img
        src={hasError ? fallbackSrc : src}
        alt={alt}
        loading={effectiveLoading}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          className
        )}
        sizes={sizes}
      />
    </picture>
  );
}

/**
 * Hero image component optimized for above-the-fold content
 * Uses eager loading and high fetch priority
 */
export function HeroImage({
  src,
  alt,
  className
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      loading="eager"
      decoding="async"
      fetchPriority="high"
      className={className}
    />
  );
}

/**
 * Card/Grid image component with lazy loading
 */
export function CardImage({
  src,
  alt,
  className
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
    />
  );
}
