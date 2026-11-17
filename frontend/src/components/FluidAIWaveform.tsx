'use client';

import React, { useEffect, useRef } from 'react';

interface FluidAIWaveformProps {
  isActive?: boolean;
  className?: string;
}

export default function FluidAIWaveform({
  isActive = false,
  className = '',
}: FluidAIWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let step = 0;

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = canvas.parentElement?.clientWidth || 300;
      canvas.height = 64;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const waves = [
      { color: 'rgba(6, 182, 212, 0.8)', frequency: 0.02, speed: 0.04, amp: isActive ? 18 : 6 },
      { color: 'rgba(168, 85, 247, 0.7)', frequency: 0.03, speed: 0.03, amp: isActive ? 14 : 4 },
      { color: 'rgba(52, 211, 153, 0.6)', frequency: 0.015, speed: 0.025, amp: isActive ? 12 : 5 },
    ];

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      step += 1;

      const centerY = canvas.height / 2;

      waves.forEach((wave) => {
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = 2;
        ctx.shadowColor = wave.color;
        ctx.shadowBlur = 10;

        ctx.beginPath();
        for (let x = 0; x < canvas.width; x++) {
          const y =
            centerY +
            Math.sin(x * wave.frequency + step * wave.speed) *
              wave.amp *
              Math.sin((x / canvas.width) * Math.PI); // Pin the ends to 0 amplitude
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isActive]);

  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="w-full h-16 pointer-events-none" />
    </div>
  );
}
