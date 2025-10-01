"use client";

import React from 'react';
import useEmblaCarousel, { type EmblaOptionsType } from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ProjectImageCarouselProps {
  images: string[] | Record<string, string>;
  altText: string;
  options?: EmblaOptionsType;
  showArrows?: boolean;
  showDots?: boolean;
  className?: string;
}

const ProjectImageCarousel: React.FC<ProjectImageCarouselProps> = ({ 
  images: initialImages,
  altText,
  options = { loop: true },
  showArrows = true,
  showDots = true,
  className
}) => {
  const images = React.useMemo(() => 
    (Array.isArray(initialImages) ? initialImages : Object.values(initialImages)).filter(Boolean),
    [initialImages]
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay({ delay: 4000, stopOnInteraction: true })]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const scrollPrev = React.useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = React.useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = React.useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi]);

  if (!images || images.length === 0) {
    return (
      <div className={cn("w-full aspect-video bg-muted rounded-lg flex items-center justify-center", className)}>
        <p className="text-muted-foreground">No images available.</p>
      </div>
    );
  }

  return (
    <div className={cn("relative w-full", className)}>
      <div className="overflow-hidden rounded-lg" ref={emblaRef}>
        <div className="flex">
          {images.map((src, index) => (
            <div className="relative flex-shrink-0 w-full aspect-video" key={index}>
              <Image
                src={src}
                alt={`${altText} - Image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      </div>

      {showArrows && images.length > 1 && (
        <>
          <button 
            onClick={scrollPrev} 
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-background/50 hover:bg-background/80 p-2 rounded-full z-10 transition-colors"
            aria-label="Previous Image">
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
          <button 
            onClick={scrollNext} 
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-background/50 hover:bg-background/80 p-2 rounded-full z-10 transition-colors"
            aria-label="Next Image">
            <ChevronRight className="w-6 h-6 text-foreground" />
          </button>
        </>
      )}

      {showDots && images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, index) => (
            <button 
              key={index} 
              onClick={() => scrollTo(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                selectedIndex === index ? 'bg-primary scale-125' : 'bg-background/50 hover:bg-primary/50'
              )}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectImageCarousel;
