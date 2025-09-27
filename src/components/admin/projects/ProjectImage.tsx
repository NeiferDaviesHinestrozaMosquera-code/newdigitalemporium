"use client";

import Image from 'next/image';
import { useState } from 'react';

interface ProjectImageProps {
  src: string;
  alt: string;
  title: string;
  dataAiHint?: string;
}

export default function ProjectImage({ src, alt, title, dataAiHint }: ProjectImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    console.error(`❌ Image load error for project "${title}":`, src);
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    console.log(`✅ Image loaded successfully for project "${title}":`, src);
    setImageLoading(false);
  };

  // Si hay error, mostrar imagen de fallback
  const imageSrc = imageError ? 'https://placehold.co/600x400/e2e8f0/64748b?text=Image+Error' : src;

  return (
    <div className="relative w-full h-48 rounded-t-lg overflow-hidden bg-gray-100">
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <Image 
        src={imageSrc}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition-opacity duration-300"
        data-ai-hint={dataAiHint || 'project image'}
        onError={handleImageError}
        onLoad={handleImageLoad}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R7+XvLvK5U2DEIbdyZmjQE4x03rJy8cevgDITSa+hV4ePPBXGK+aMqI4FfWjfOT+zWdFEsNalZFTOtJ0RiOSuRj18HZZ3cMrVCkrZFIFHT7qLr5j7w72xzGVi+2xFP2cYTlpNFv5TXhOe76vwA8bKrXIufrYovWRLbpC1BEMhZSu4T1LJFh3nzAD5cYdlKGxmfA="
        priority={false}
      />
      {/* Overlay para mostrar información adicional */}
      <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300 flex items-end">
        <div className="p-3 text-white opacity-0 hover:opacity-100 transition-opacity duration-300">
          <span className="text-xs font-medium">Click to edit</span>
        </div>
      </div>
    </div>
  );
}
