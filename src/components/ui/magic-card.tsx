"use client";

import { cn } from "@/lib/utils";
import { motion, useMotionValue, useMotionTemplate, useMotionValueEvent } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

interface MagicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  gradientColor?: string;
  gradientOpacity?: number;
  gradientSize?: number;
}

export const MagicCard = React.forwardRef<HTMLDivElement, MagicCardProps>(
  ({ 
    children, 
    className, 
    gradientColor = "#262626", 
    gradientOpacity = 0.8,
    gradientSize = 200,
    ...props 
  }, ref) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };

    const backgroundImage = useMotionTemplate`radial-gradient(${gradientSize}px at ${mouseX}px ${mouseY}px, ${gradientColor}${Math.round(gradientOpacity * 255).toString(16).padStart(2, '0')} 0%, transparent 100%)`;

    return (
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950/50 p-6",
          className
        )}
        {...props}
      >
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: backgroundImage,
          }}
        />
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }
);

MagicCard.displayName = "MagicCard";