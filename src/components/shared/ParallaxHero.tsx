"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface ParallaxHeroProps {
  children: React.ReactNode;
  className?: string;
}

const ParallaxHero: React.FC<ParallaxHeroProps> = ({ children, className }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "200%"]);

  return (
    <div
      ref={ref}
      className={`relative w-full h-screen overflow-hidden ${className}`}
    >
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          y: backgroundY,
        }}
      />
      <motion.div
        className="absolute inset-0 z-10 flex flex-col items-center justify-center"
        style={{
          y: textY,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default ParallaxHero;
