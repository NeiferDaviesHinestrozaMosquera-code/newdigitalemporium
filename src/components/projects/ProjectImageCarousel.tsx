"use client";

import React, { useState, useEffect } from "react";
import useEmblaCarousel, { type EmblaOptionsType } from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
  className,
}) => {
  const images = React.useMemo(
    () =>
      (Array.isArray(initialImages)
        ? initialImages
        : Object.values(initialImages)
      ).filter(Boolean),
    [initialImages]
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    Autoplay({ delay: 4000, stopOnInteraction: true }),
  ]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [isHovering, setIsHovering] = React.useState(false);

  const scrollPrev = React.useCallback(() => {
    emblaApi && emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    emblaApi && emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = React.useCallback((index: number) => {
    emblaApi && emblaApi.scrollTo(index);
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  if (!images || images.length === 0) {
    return (
      <div
        className={cn(
          "w-full aspect-video bg-muted rounded-lg flex items-center justify-center",
          className
        )}
      >
        <p className="text-muted-foreground">No images available.</p>
      </div>
    );
  }

  return (
    <div
      className={cn("relative w-full group", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="overflow-hidden rounded-lg shadow-lg" ref={emblaRef}>
        <div className="flex">
          {images.map((src, index) => (
            <motion.div
              className="relative flex-shrink-0 w-full aspect-video"
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src={src}
                alt={`${altText} - Image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              {/* Overlay gradient on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"
                initial={{ opacity: 0 }}
                animate={isHovering ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.3 }}
              />

              {/* Image counter */}
              <motion.div
                className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold"
                initial={{ opacity: 0, y: -10 }}
                animate={isHovering ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {index + 1} / {images.length}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      {showArrows && images.length > 1 && (
        <>
          <motion.button
            onClick={scrollPrev}
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-background/50 hover:bg-background/80 backdrop-blur-sm p-2 rounded-full z-10 transition-all duration-300 shadow-lg"
            aria-label="Previous Image"
            whileHover={{ scale: 1.15, backgroundColor: "rgba(0,0,0,0.9)" }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: -10 }}
            animate={isHovering ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </motion.button>

          <motion.button
            onClick={scrollNext}
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-background/50 hover:bg-background/80 backdrop-blur-sm p-2 rounded-full z-10 transition-all duration-300 shadow-lg"
            aria-label="Next Image"
            whileHover={{ scale: 1.15, backgroundColor: "rgba(0,0,0,0.9)" }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: 10 }}
            animate={isHovering ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-6 h-6 text-foreground" />
          </motion.button>
        </>
      )}

      {/* Dot indicators */}
      {showDots && images.length > 1 && (
        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10 bg-background/40 backdrop-blur-sm px-4 py-2 rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {images.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => scrollTo(index)}
              className={cn(
                "transition-all duration-300 rounded-full",
                selectedIndex === index
                  ? "bg-primary w-3 h-3 scale-125"
                  : "bg-background/50 hover:bg-primary/50 w-2 h-2"
              )}
              aria-label={`Go to image ${index + 1}`}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </motion.div>
      )}

      {/* Progress bar */}
      {images.length > 1 && (
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-primary"
          initial={{ width: "0%" }}
          animate={{ width: `${((selectedIndex + 1) / images.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      )}
    </div>
  );
};

export default ProjectImageCarousel;
