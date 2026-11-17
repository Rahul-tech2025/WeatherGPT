'use client';

import React, { useRef, useState, useCallback, ReactNode } from 'react';

interface InteractiveTiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number; // max tilt in degrees (default 5)
  glareOpacity?: number; // max glare opacity (default 0.28, balanced & refined)
  scaleOnHover?: number; // slight scale on hover (default 1.008)
  borderRadius?: string; // custom border radius to eliminate clipping artifacts
}

export default function InteractiveTiltCard({
  children,
  className = '',
  maxTilt = 5,
  glareOpacity = 0.28,
  scaleOnHover = 1.008,
  borderRadius,
}: InteractiveTiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState<string>('');
  const [glareStyle, setGlareStyle] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0,
  });
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Ultra-smooth physical tilt angles with subtle inertia
      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      // Glare coordinates
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;

      setTransformStyle(
        `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scaleOnHover}, ${scaleOnHover}, 1)`
      );
      setGlareStyle({
        x: glareX,
        y: glareY,
        opacity: glareOpacity,
      });
    },
    [maxTilt, glareOpacity, scaleOnHover]
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransformStyle('perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlareStyle((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transition: isHovered
          ? 'transform 0.18s cubic-bezier(0.2, 0.9, 0.3, 1)'
          : 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden',
        outline: '1px solid transparent', // Crucial hardware anti-aliasing fix: eliminates staircase edge artifacts on 3D rotation
        borderRadius: borderRadius,
      }}
      className={`relative overflow-hidden group select-none ${className}`}
    >
      {/* Specular Starlight Glare Layer with smooth rounded boundary */}
      <div
        className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300 rounded-[inherit]"
        style={{
          opacity: glareStyle.opacity,
          background: `radial-gradient(circle at ${glareStyle.x}% ${glareStyle.y}%, rgba(255, 255, 255, 0.42) 0%, rgba(255, 255, 255, 0.18) 22%, rgba(255, 255, 255, 0.03) 48%, transparent 70%)`,
          borderRadius: 'inherit',
        }}
      />
      {children}
    </div>
  );
}
