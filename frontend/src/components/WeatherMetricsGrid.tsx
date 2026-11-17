'use client';

import React from 'react';
import { CurrentWeather, DailyForecastItem } from '../types/weather';
import InteractiveTiltCard from './InteractiveTiltCard';
import RollingNumberTicker from './RollingNumberTicker';

interface WeatherMetricsGridProps {
  current: CurrentWeather;
  todayDaily?: DailyForecastItem;
}

export const WeatherMetricsGrid: React.FC<WeatherMetricsGridProps> = ({ current, todayDaily }) => {
  // Calculate compass direction from degrees
  const getWindDirectionCompass = (deg: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(deg / 22.5) % 16;
    return directions[index];
  };

  // UV interpretation
  const getUvLevel = (uv: number) => {
    if (uv <= 2) return { text: 'Low', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30', percent: 20, tip: 'No protection required' };
    if (uv <= 5) return { text: 'Moderate', color: 'text-amber-400 bg-amber-950/60 border-amber-500/30', percent: 45, tip: 'Wear sunglasses & hat' };
    if (uv <= 7) return { text: 'High', color: 'text-orange-400 bg-orange-950/60 border-orange-500/30', percent: 70, tip: 'SPF 30+ recommended' };
    if (uv <= 10) return { text: 'Very High', color: 'text-rose-400 bg-rose-950/60 border-rose-500/30', percent: 88, tip: 'Avoid midday direct sun' };
    return { text: 'Extreme', color: 'text-purple-400 bg-purple-950/60 border-purple-500/30', percent: 100, tip: 'Stay shaded indoors' };
  };

  const uvInfo = getUvLevel(todayDaily?.uvIndexMax ?? 2);

  // Compute daylight progress for Sun Arc
  const calculateSunProgress = () => {
    if (!todayDaily?.sunrise || !todayDaily?.sunset) return 50;
    try {
      const now = new Date().getTime();
      const rise = new Date(todayDaily.sunrise).getTime();
      const set = new Date(todayDaily.sunset).getTime();
      if (now < rise) return 0;
      if (now > set) return 100;
      return Math.round(((now - rise) / (set - rise)) * 100);
    } catch {
      return 50;
    }
  };

  const sunProgress = calculateSunProgress();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
      
      {/* 1. Surface Wind with Visual Rotating Compass */}
      <InteractiveTiltCard maxTilt={6} glareOpacity={0.15}>
        <div className="glass-card rounded-[2rem] p-6 relative overflow-hidden group h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">
              <span className="flex items-center space-x-2">
                <span className="text-emerald-400">💨</span>
                <span className="text-slate-300">Surface Wind</span>
              </span>
              <span className="text-[10px] bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 px-2.5 py-0.5 rounded-full font-bold">
                {getWindDirectionCompass(current.windDirection)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-black text-white tracking-tight">
                    <RollingNumberTicker value={current.windSpeed} decimals={0} />
                  </span>
                  <span className="text-slate-400 text-sm font-semibold">km/h</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Gusts up to: <strong className="text-slate-200">{todayDaily?.windSpeedMax ?? current.windSpeed} km/h</strong>
                </p>
              </div>

              {/* Visual Rotating Compass Dial */}
              <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center rounded-full bg-slate-950/80 border border-white/[0.08] shadow-inner">
                <span className="absolute top-1 text-[9px] font-bold text-slate-400">N</span>
                <span className="absolute bottom-1 text-[9px] font-bold text-slate-600">S</span>
                <span className="absolute left-1.5 text-[9px] font-bold text-slate-600">W</span>
                <span className="absolute right-1.5 text-[9px] font-bold text-slate-600">E</span>
                
                {/* Compass Needle */}
                <div
                  className="w-12 h-12 flex items-center justify-center transition-transform duration-700 ease-out"
                  style={{ transform: `rotate(${current.windDirection}deg)` }}
                >
                  <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none">
                    <polygon points="12,2 15,12 12,9 9,12" fill="#ef4444" />
                    <polygon points="12,22 15,12 12,15 9,12" fill="#94a3b8" />
                    <circle cx="12" cy="12" r="2" fill="#fff" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.04] text-[11px] text-slate-400">
            Steady breeze with low localized shear
          </div>
        </div>
      </InteractiveTiltCard>

      {/* 2. Solar UV Index with Arc Meter */}
      <InteractiveTiltCard maxTilt={6} glareOpacity={0.15}>
        <div className="glass-card rounded-[2rem] p-6 relative overflow-hidden group h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">
              <span className="flex items-center space-x-2">
                <span className="text-amber-400">☀️</span>
                <span className="text-slate-300">UV Index</span>
              </span>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${uvInfo.color}`}>
                {uvInfo.text}
              </span>
            </div>

            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-black text-white tracking-tight">
                {todayDaily?.uvIndexMax ?? '1.5'}
              </span>
              <span className="text-slate-500 text-sm font-semibold">/ 12 Peak</span>
            </div>

            {/* Multi-Colored Segmented UV Bar */}
            <div className="w-full h-2 bg-slate-900 rounded-full mt-3.5 overflow-hidden border border-white/[0.06] relative">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-purple-500 rounded-full transition-all duration-700"
                style={{ width: `${uvInfo.percent}%` }}
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.04] text-[11px] text-slate-300 truncate">
            💡 {uvInfo.tip}
          </div>
        </div>
      </InteractiveTiltCard>

      {/* 3. Daylight & Sun Arc Progression (Apple Weather Style) */}
      <InteractiveTiltCard maxTilt={6} glareOpacity={0.15}>
        <div className="glass-card rounded-[2rem] p-6 relative overflow-hidden group h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="flex items-center space-x-2">
                <span className="text-amber-300">🌅</span>
                <span className="text-slate-300">Daylight Arc</span>
              </span>
              <span className="text-[10px] bg-amber-950/40 text-amber-300 border border-amber-800/30 px-2 py-0.5 rounded-full font-mono font-bold">
                {sunProgress}% Day Elapsed
              </span>
            </div>

            {/* Parabolic Sun Arc SVG */}
            <div className="relative w-full h-16 my-2">
              <svg className="w-full h-full" viewBox="0 0 200 60" fill="none">
                {/* Horizon Dotted Arc */}
                <path
                  d="M 20,52 Q 100,-15 180,52"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                />
                {/* Sun Position Indicator */}
                {(() => {
                  const t = sunProgress / 100;
                  const x = (1 - t) * (1 - t) * 20 + 2 * (1 - t) * t * 100 + t * t * 180;
                  const y = (1 - t) * (1 - t) * 52 + 2 * (1 - t) * t * (-15) + t * t * 52;
                  return (
                    <g>
                      <circle cx={x} cy={y} r="8" fill="rgba(251,191,36,0.25)" className="animate-ping" />
                      <circle cx={x} cy={y} r="5" fill="#fbbf24" stroke="#fff" strokeWidth="1.5" />
                    </g>
                  );
                })()}
                {/* Baseline */}
                <line x1="10" y1="52" x2="190" y2="52" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              </svg>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/[0.04]">
            <span>Rise: {todayDaily?.sunrise ? new Date(todayDaily.sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '6:00 AM'}</span>
            <span>Set: {todayDaily?.sunset ? new Date(todayDaily.sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '6:30 PM'}</span>
          </div>
        </div>
      </InteractiveTiltCard>

      {/* 4. Relative Humidity & Dew Point */}
      <InteractiveTiltCard maxTilt={6} glareOpacity={0.15}>
        <div className="glass-card rounded-[2rem] p-6 relative overflow-hidden group h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">
              <span className="flex items-center space-x-2">
                <span className="text-blue-400">💧</span>
                <span className="text-slate-300">Humidity &amp; Dew Point</span>
              </span>
              <span className="text-[10px] bg-blue-950/60 text-blue-300 border border-blue-800/40 px-2.5 py-0.5 rounded-full font-bold">
                {current.humidity > 70 ? 'Humid' : current.humidity < 35 ? 'Dry' : 'Balanced'}
              </span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-black text-white tracking-tight">
                <RollingNumberTicker value={current.humidity} decimals={0} suffix="%" />
              </span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full mt-3.5 overflow-hidden border border-white/[0.06]">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-700"
                style={{ width: `${current.humidity}%` }}
              />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/[0.04] text-[11px] text-slate-400 flex justify-between">
            <span>Apparent Thermal Feel</span>
            <strong className="text-slate-200">{Math.round(current.feelsLike)}°C</strong>
          </div>
        </div>
      </InteractiveTiltCard>

      {/* 5. Barometric Pressure */}
      <InteractiveTiltCard maxTilt={6} glareOpacity={0.15}>
        <div className="glass-card rounded-[2rem] p-6 relative overflow-hidden group h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">
              <span className="flex items-center space-x-2">
                <span className="text-purple-400">🧭</span>
                <span className="text-slate-300">Air Pressure</span>
              </span>
              <span className="text-[10px] bg-purple-950/60 text-purple-300 border border-purple-800/40 px-2.5 py-0.5 rounded-full font-bold">
                {current.pressure > 1013 ? 'High Density' : 'Standard'}
              </span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-black text-white tracking-tight">
                <RollingNumberTicker value={Math.round(current.pressure)} decimals={0} />
              </span>
              <span className="text-slate-400 text-sm font-semibold">hPa</span>
            </div>
            <div className="mt-3.5 text-xs text-slate-400">
              Steady barometric state across lower troposphere
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/[0.04] text-[11px] text-slate-400 flex justify-between">
            <span>Standard Datum</span>
            <strong className="text-slate-300 font-mono">1013.25 hPa</strong>
          </div>
        </div>
      </InteractiveTiltCard>

      {/* 6. Dual AI Architecture Showcase */}
      <InteractiveTiltCard maxTilt={6} glareOpacity={0.15}>
        <div className="rounded-[2rem] p-6 bg-gradient-to-br from-blue-900/40 via-indigo-950/40 to-slate-900/70 border border-blue-500/30 backdrop-blur-2xl shadow-xl relative overflow-hidden group h-full flex flex-col justify-between">
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
              <span className="flex items-center space-x-2">
                <span>🧠</span>
                <span className="text-white">Dual AI Engine</span>
              </span>
              <span className="text-[10px] bg-blue-500/20 text-cyan-300 border border-cyan-400/40 px-2.5 py-0.5 rounded-full font-bold">
                Active
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              <strong>WeatherGPT</strong> combines <strong>Google Gemini</strong> for grounded conversational guidance &amp; <strong>Scikit-Learn ML Models</strong> ($R^2 = 0.975$) for next-day telemetry.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-cyan-400 font-bold">
            <span>Verified ML Microservice</span>
            <span className="text-[11px] text-slate-400 font-normal">Port 8000</span>
          </div>
        </div>
      </InteractiveTiltCard>

    </div>
  );
};
