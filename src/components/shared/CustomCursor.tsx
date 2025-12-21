"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface MousePosition {
  x: number;
  y: number;
}

const CustomCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener('mousemove', mouseMove);

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactiveElements = [
        'a', 'button', 'input', 'textarea', 'select', '[data-cursor-hover="true"]'
      ];
      
      const isInteractive = interactiveElements.some(selector => target.closest(selector));
      setIsHovering(isInteractive);
    };

    window.addEventListener('mouseover', handleHover);
    window.addEventListener('mouseout', handleHover);

    return () => {
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mouseover', handleHover);
      window.removeEventListener('mouseout', handleHover);
    };
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      scale: 1,
    },
    hover: {
      x: mousePosition.x - 32,
      y: mousePosition.y - 32,
      scale: 2,
    },
  };

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <motion.div
      className={`fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] border-2 transition-colors duration-300 ${
        isHovering 
          ? 'bg-accent/80 border-accent mix-blend-difference' 
          : 'bg-primary/50 border-primary'
      }`}
      variants={variants}
      animate={isHovering ? "hover" : "default"}
      transition={{ type: "tween", ease: "backOut", duration: 0.3 }}
    />
  );
};

export default CustomCursor;