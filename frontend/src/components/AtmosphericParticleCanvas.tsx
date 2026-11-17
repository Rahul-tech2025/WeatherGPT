'use client';

import React, { useEffect, useRef, useState } from 'react';

interface AtmosphericParticleCanvasProps {
  condition?: string;
  isDay?: boolean;
  rainIntensity?: number; // 0 to 100
}

interface Particle {
  x: number;
  y: number;
  speedY: number;
  speedX: number;
  size: number;
  alpha: number;
  alphaSpeed: number;
  color: string;
}

export default function AtmosphericParticleCanvas({
  condition = 'Clear',
  isDay = true,
  rainIntensity = 0,
}: AtmosphericParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const cond = condition.toLowerCase();
  const isRain = cond.includes('rain') || cond.includes('drizzle') || cond.includes('shower') || rainIntensity > 20;
  const isThunder = cond.includes('thunder') || cond.includes('storm');
  const isSnow = cond.includes('snow') || cond.includes('flurry');
  const isNight = !isDay;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isEnabled) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / width - 0.5) * 30,
        y: (e.clientY / height - 0.5) * 30,
      };
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Particle Generation
    const particleCount = isRain ? 65 : isSnow ? 50 : isNight ? 55 : 35;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(width, height, isRain, isSnow, isNight));
    }

    function createParticle(w: number, h: number, rain: boolean, snow: boolean, night: boolean): Particle {
      if (rain) {
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          speedY: 10 + Math.random() * 14,
          speedX: -1.5 - Math.random() * 2,
          size: 1.2 + Math.random() * 1.5,
          alpha: 0.2 + Math.random() * 0.4,
          alphaSpeed: 0,
          color: 'rgba(56, 189, 248, ', // sky blue rain streak
        };
      } else if (snow) {
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          speedY: 1 + Math.random() * 2.5,
          speedX: -1 + Math.random() * 2,
          size: 2 + Math.random() * 3,
          alpha: 0.3 + Math.random() * 0.5,
          alphaSpeed: 0.005,
          color: 'rgba(255, 255, 255, ',
        };
      } else if (night) {
        // Twinkling stars
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          speedY: (Math.random() - 0.5) * 0.1,
          speedX: (Math.random() - 0.5) * 0.1,
          size: 0.8 + Math.random() * 2.2,
          alpha: 0.2 + Math.random() * 0.7,
          alphaSpeed: 0.006 + Math.random() * 0.012,
          color: Math.random() > 0.3 ? 'rgba(224, 242, 254, ' : 'rgba(216, 180, 254, ', // ice blue or soft violet
        };
      } else {
        // Daylight golden solar motes / ambient dust
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          speedY: -0.4 - Math.random() * 0.8,
          speedX: (Math.random() - 0.5) * 0.6,
          size: 1.5 + Math.random() * 2.5,
          alpha: 0.15 + Math.random() * 0.35,
          alphaSpeed: 0.004,
          color: 'rgba(254, 240, 138, ', // warm golden sunbeam mote
        };
      }
    }

    let lightningTimer = 0;
    let lightningFlash = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Thunderstorm flash simulation
      if (isThunder) {
        lightningTimer++;
        if (lightningTimer > 240 && Math.random() < 0.03) {
          lightningFlash = 0.35 + Math.random() * 0.3;
          lightningTimer = 0;
        }
        if (lightningFlash > 0) {
          ctx.fillStyle = `rgba(192, 132, 252, ${lightningFlash})`;
          ctx.fillRect(0, 0, width, height);
          lightningFlash -= 0.04;
        }
      }

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (isRain) {
          // Draw elongated rain streak
          ctx.strokeStyle = `${p.color}${p.alpha})`;
          ctx.lineWidth = p.size;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.speedX * 2, p.y + p.speedY * 2.5);
          ctx.stroke();

          p.x += p.speedX;
          p.y += p.speedY;

          if (p.y > height) {
            p.y = -20;
            p.x = Math.random() * width;
          }
          if (p.x < 0) p.x = width;
        } else {
          // Draw glowing point / mote / star
          p.alpha += p.alphaSpeed;
          if (p.alpha > 0.85 || p.alpha < 0.15) {
            p.alphaSpeed = -p.alphaSpeed;
          }

          ctx.fillStyle = `${p.color}${Math.max(0, Math.min(1, p.alpha))})`;
          ctx.beginPath();
          // Add subtle parallax offset from mouse
          const renderX = p.x + mx * (p.size * 0.15);
          const renderY = p.y + my * (p.size * 0.15);
          ctx.arc(renderX, renderY, p.size, 0, Math.PI * 2);
          ctx.fill();

          p.x += p.speedX;
          p.y += p.speedY;

          if (p.y < -10) p.y = height + 10;
          if (p.y > height + 10) p.y = -10;
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [condition, isDay, rainIntensity, isEnabled, isRain, isSnow, isNight, isThunder]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none -z-20 w-full h-full transition-opacity duration-1000"
        style={{ opacity: isEnabled ? 1 : 0 }}
      />
      {/* Discreet Atmospheric Ambience Toggle Button in Bottom-Right */}
      <button
        onClick={() => setIsEnabled(!isEnabled)}
        title={isEnabled ? 'Disable Ambient Weather Canvas' : 'Enable Ambient Weather Canvas'}
        aria-label="Toggle Living Canvas"
        className="fixed bottom-3 right-3 z-40 px-2.5 py-1 rounded-full bg-slate-950/60 hover:bg-slate-900 border border-white/10 text-[10px] font-mono text-slate-400 hover:text-cyan-300 backdrop-blur-md transition-all shadow-lg flex items-center space-x-1.5"
      >
        <span className={`w-1.5 h-1.5 rounded-full ${isEnabled ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`} />
        <span className="hidden sm:inline">{isEnabled ? 'Atmosphere: ON' : 'Atmosphere: OFF'}</span>
      </button>
    </>
  );
}
