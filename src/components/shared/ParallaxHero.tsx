"use client";

import { motion, useScroll, useTransform, useMousePosition } from "framer-motion";
import { useRef, useState, useEffect } from "react";

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
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.5]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  // Mouse tracking for parallax effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovering) return;
      
      const rect = (ref.current as HTMLElement)?.getBoundingClientRect();
      if (!rect) return;

      const x = (e.clientX - rect.left - rect.width / 2) / 50;
      const y = (e.clientY - rect.top - rect.height / 2) / 50;
      
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isHovering]);

  return (
    <div
      ref={ref}
      className={`relative w-full h-screen overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setMousePosition({ x: 0, y: 0 });
      }}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 z-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent"
        style={{
          y: backgroundY,
        }}
      />

      {/* Floating elements for visual interest */}
      <motion.div
        className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
        animate={{
          x: mousePosition.x * 10,
          y: mousePosition.y * 10,
        }}
        transition={{ type: "spring", stiffness: 100, damping: 30 }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
        animate={{
          x: -mousePosition.x * 15,
          y: -mousePosition.y * 15,
        }}
        transition={{ type: "spring", stiffness: 100, damping: 30 }}
      />

      {/* Main content */}
      <motion.div
        className="absolute inset-0 z-10 flex flex-col items-center justify-center"
        style={{
          y: textY,
          opacity,
          scale,
        }}
      >
        <motion.div
          animate={{
            x: mousePosition.x * 5,
            y: mousePosition.y * 5,
          }}
          transition={{ type: "spring", stiffness: 100, damping: 30 }}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ParallaxHero;
