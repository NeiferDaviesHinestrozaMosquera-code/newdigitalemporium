"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  parallaxIntensity?: number;
}

const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  className = "",
  id,
  parallaxIntensity = 50,
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [parallaxIntensity, -parallaxIntensity]
  );

  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      style={{ y }}
    >
      {children}
    </motion.section>
  );
};

export default ParallaxSection;
