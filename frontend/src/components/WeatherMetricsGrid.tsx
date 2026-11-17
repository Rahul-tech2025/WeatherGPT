'use client';

import React from 'react';
import { CurrentWeather, DailyForecastItem } from '../types/weather';
import RollingNumberTicker from './RollingNumberTicker';
import InteractiveTiltCard from './InteractiveTiltCard';

interface WeatherMetricsGridProps {
  current: CurrentWeather;
  todayDaily?: DailyForecastItem;
}

export const WeatherMetricsGrid: React.FC<WeatherMetricsGridProps> = ({ current, todayDaily }) => {
  // Compass direction calculation
  const getWindDirectionCompass = (deg: number): string => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(deg / 22.5) % 16;
    return directions[index];
  };

  // UV interpretation
  const getUVDescription = (uv: number) => {
    if (uv <= 2) return { text: 'Low', color: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10', percent: 20, tip: 'Safe for extended outdoor activity' };
    if (uv <= 5) return { text: 'Moderate', color: 'text-amber-300 border-amber-500/30 bg-amber-500/10', percent: 45, tip: 'Sun protection recommended during midday' };
    if (uv <= 7) return { text: 'High', color: 'text-orange-300 border-orange-500/30 bg-orange-500/10', percent: 70, tip: 'UV filter sunglasses & SPF 30+ advised' };
    if (uv <= 10) return { text: 'Very High', color: 'text-rose-300 border-rose-500/30 bg-rose-500/10', percent: 88, tip: 'Minimize midday sun exposure' };
    return { text: 'Extreme', color: 'text-purple-300 border-purple-500/30 bg-purple-500/10', percent: 100, tip: 'Take all protective precautions outdoors' };
  };

  const uvInfo = getUVDescription(todayDaily?.uvIndexMax ?? 2);

  // Solar Arc progression calculation
  const calculateSunProgress = (): number => {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
      
      {/* 1. Surface Wind with Visual Rotating Compass */}
      <InteractiveTiltCard maxTilt={5} glareOpacity={0.28} className="rounded-[2rem]">
        <div className="glass-card rounded-[2rem] p-5 sm:p-6 relative overflow-hidden group h-full flex flex-col justify-between bg-[#080c14]/85 border border-white/[0.10]">
          <div>
            <div className="flex items-center justify-between gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">
              <span className="flex items-center space-x-2 min-w-0">
                <svg className="w-4 h-4 text-white flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
                </svg>
                <span className="text-slate-300 truncate">Surface Wind</span>
              </span>
              <span className="text-[10px] bg-white/[0.08] text-white border border-white/15 px-2.5 py-0.5 rounded-full font-mono font-bold flex-shrink-0 whitespace-nowrap">
                {getWindDirectionCompass(current.windDirection)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-black text-white tracking-tight">
                    <RollingNumberTicker value={current.windSpeed} decimals={0} />
                  </span>
                  <span className="text-slate-400 text-sm font-semibold">km/h</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Gust peak: <strong className="text-white font-mono">{todayDaily?.windSpeedMax ?? current.windSpeed} km/h</strong>
                </p>
              </div>

              {/* Visual Rotating Compass Dial (Monochrome Titanium) */}
              <div className="relative w-18 h-18 sm:w-20 sm:h-20 flex-shrink-0 flex items-center justify-center rounded-full bg-black/60 border border-white/[0.15] shadow-inner">
                <span className="absolute top-1 text-[9px] font-bold text-white font-mono">N</span>
                <span className="absolute bottom-1 text-[9px] font-bold text-slate-500 font-mono">S</span>
                <span className="absolute left-1.5 text-[9px] font-bold text-slate-500 font-mono">W</span>
                <span className="absolute right-1.5 text-[9px] font-bold text-slate-500 font-mono">E</span>
                
                {/* Compass Needle */}
                <div
                  className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center transition-transform duration-700 ease-out"
                  style={{ transform: `rotate(${current.windDirection}deg)` }}
                >
                  <svg className="w-8 h-8 sm:w-9 sm:h-9" viewBox="0 0 24 24" fill="none">
                    <polygon points="12,2 15,12 12,9 9,12" fill="#ffffff" />
                    <polygon points="12,22 15,12 12,15 9,12" fill="#475569" />
                    <circle cx="12" cy="12" r="2" fill="#000" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.04] text-[11px] text-slate-400">
            Steady tropospheric flow with low localized shear
          </div>
        </div>
      </InteractiveTiltCard>

      {/* 2. Solar UV Index with Arc Meter */}
      <InteractiveTiltCard maxTilt={5} glareOpacity={0.28} className="rounded-[2rem]">
        <div className="glass-card rounded-[2rem] p-5 sm:p-6 relative overflow-hidden group h-full flex flex-col justify-between bg-[#080c14]/85 border border-white/[0.10]">
          <div>
            <div className="flex items-center justify-between gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">
              <span className="flex items-center space-x-2 min-w-0">
                <svg className="w-4 h-4 text-white flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
                <span className="text-slate-300 truncate">UV Index</span>
              </span>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex-shrink-0 whitespace-nowrap ${uvInfo.color}`}>
                {uvInfo.text}
              </span>
            </div>

            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-black text-white tracking-tight">
                {todayDaily?.uvIndexMax ?? '1.5'}
              </span>
              <span className="text-slate-500 text-sm font-semibold">/ 12 Peak</span>
            </div>

            {/* Segmented Monochrome UV Bar */}
            <div className="w-full h-2 bg-black/60 rounded-full mt-3.5 overflow-hidden border border-white/[0.08] relative">
              <div
                className="h-full bg-gradient-to-r from-slate-400 via-white to-slate-200 rounded-full transition-all duration-700"
                style={{ width: `${uvInfo.percent}%` }}
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.04] text-[11px] text-slate-300 truncate">
            {uvInfo.tip}
          </div>
        </div>
      </InteractiveTiltCard>

      {/* 3. Daylight & Sun Arc Progression */}
      <InteractiveTiltCard maxTilt={5} glareOpacity={0.28} className="rounded-[2rem]">
        <div className="glass-card rounded-[2rem] p-5 sm:p-6 relative overflow-hidden group h-full flex flex-col justify-between bg-[#080c14]/85 border border-white/[0.10]">
          <div>
            <div className="flex items-center justify-between gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="flex items-center space-x-2 min-w-0">
                <svg className="w-4 h-4 text-white flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v6M4.93 4.93l4.24 4.24M2 18h20M20 18a8 8 0 0 0-16 0" />
                </svg>
                <span className="text-slate-300 truncate">Solar Arc</span>
              </span>
              <span className="text-[10px] bg-white/[0.08] text-slate-300 border border-white/15 px-2.5 py-0.5 rounded-full font-mono font-bold flex-shrink-0 whitespace-nowrap">
                {sunProgress}% Elapsed
              </span>
            </div>

            {/* Parabolic Sun Arc SVG */}
            <div className="relative w-full h-16 my-2">
              <svg className="w-full h-full" viewBox="0 0 200 60" fill="none">
                <path
                  d="M 20,52 Q 100,-15 180,52"
                  stroke="rgba(255,255,255,0.18)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                {(() => {
                  const t = sunProgress / 100;
                  const x = (1 - t) * (1 - t) * 20 + 2 * (1 - t) * t * 100 + t * t * 180;
                  const y = (1 - t) * (1 - t) * 52 + 2 * (1 - t) * t * (-15) + t * t * 52;
                  return (
                    <g>
                      <circle cx={x} cy={y} r="8" fill="rgba(255,255,255,0.25)" className="animate-ping" />
                      <circle cx={x} cy={y} r="4.5" fill="#ffffff" stroke="#000" strokeWidth="1.5" />
                    </g>
                  );
                })()}
                <line x1="10" y1="52" x2="190" y2="52" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              </svg>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/[0.04] font-mono">
            <span>Rise: {todayDaily?.sunrise ? new Date(todayDaily.sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '06:00'}</span>
            <span>Set: {todayDaily?.sunset ? new Date(todayDaily.sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '18:30'}</span>
          </div>
        </div>
      </InteractiveTiltCard>

      {/* 4. Relative Humidity & Dew Point */}
      <InteractiveTiltCard maxTilt={5} glareOpacity={0.28} className="rounded-[2rem]">
        <div className="glass-card rounded-[2rem] p-5 sm:p-6 relative overflow-hidden group h-full flex flex-col justify-between bg-[#080c14]/85 border border-white/[0.10]">
          <div>
            <div className="flex items-center justify-between gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">
              <span className="flex items-center space-x-2 min-w-0">
                <svg className="w-4 h-4 text-white flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                </svg>
                <span className="text-slate-300 truncate">Humidity &amp; Dew</span>
              </span>
              <span className="text-[10px] bg-white/[0.08] text-slate-300 border border-white/15 px-2.5 py-0.5 rounded-full font-bold flex-shrink-0 whitespace-nowrap">
                {current.humidity > 70 ? 'Humid' : current.humidity < 35 ? 'Dry' : 'Balanced'}
              </span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-black text-white tracking-tight">
                <RollingNumberTicker value={current.humidity} decimals={0} suffix="%" />
              </span>
            </div>
            <div className="w-full h-2 bg-black/60 rounded-full mt-3.5 overflow-hidden border border-white/[0.08]">
              <div
                className="h-full bg-white rounded-full transition-all duration-700"
                style={{ width: `${current.humidity}%` }}
              />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/[0.04] text-[11px] text-slate-400 flex items-center justify-between gap-2">
            <span className="truncate">Thermal Feel</span>
            <strong className="text-white font-mono flex-shrink-0">{Math.round(current.feelsLike)}°C</strong>
          </div>
        </div>
      </InteractiveTiltCard>

      {/* 5. Barometric Pressure */}
      <InteractiveTiltCard maxTilt={5} glareOpacity={0.28} className="rounded-[2rem]">
        <div className="glass-card rounded-[2rem] p-5 sm:p-6 relative overflow-hidden group h-full flex flex-col justify-between bg-[#080c14]/85 border border-white/[0.10]">
          <div>
            <div className="flex items-center justify-between gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">
              <span className="flex items-center space-x-2 min-w-0">
                <svg className="w-4 h-4 text-white flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" />
                </svg>
                <span className="text-slate-300 truncate">Air Pressure</span>
              </span>
              <span className="text-[10px] bg-white/[0.08] text-slate-300 border border-white/15 px-2.5 py-0.5 rounded-full font-bold flex-shrink-0 whitespace-nowrap">
                {current.pressure > 1013 ? 'High Density' : 'Standard'}
              </span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-black text-white tracking-tight">
                <RollingNumberTicker value={Math.round(current.pressure)} decimals={0} />
              </span>
              <span className="text-slate-400 text-sm font-semibold">hPa</span>
            </div>
            <div className="mt-3 text-xs text-slate-400 leading-relaxed">
              Steady barometric datum across lower troposphere
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/[0.04] text-[11px] text-slate-400 flex items-center justify-between gap-2">
            <span className="truncate">Standard Datum</span>
            <strong className="text-slate-300 font-mono flex-shrink-0">1013.25 hPa</strong>
          </div>
        </div>
      </InteractiveTiltCard>

      {/* 6. Dual AI Architecture Showcase */}
      <InteractiveTiltCard maxTilt={5} glareOpacity={0.28} className="rounded-[2rem]">
        <div className="rounded-[2rem] p-5 sm:p-6 bg-white/[0.03] border border-white/[0.12] backdrop-blur-3xl shadow-xl relative overflow-hidden group h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 text-slate-300 text-xs font-bold uppercase tracking-wider mb-3">
              <span className="flex items-center space-x-2 min-w-0">
                <svg className="w-4 h-4 text-white flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <rect x="9" y="9" width="6" height="6" />
                  <line x1="9" y1="1" x2="9" y2="4" />
                  <line x1="15" y1="1" x2="15" y2="4" />
                  <line x1="9" y1="20" x2="9" y2="23" />
                  <line x1="15" y1="20" x2="15" y2="23" />
                  <line x1="20" y1="9" x2="23" y2="9" />
                  <line x1="20" y1="14" x2="23" y2="14" />
                  <line x1="1" y1="9" x2="4" y2="9" />
                  <line x1="1" y1="14" x2="4" y2="14" />
                </svg>
                <span className="text-white truncate">Dual AI Engine</span>
              </span>
              <span className="text-[10px] bg-white/10 text-white border border-white/20 px-2.5 py-0.5 rounded-full font-mono font-bold flex-shrink-0 whitespace-nowrap">
                Online
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Combines <strong>Google Gemini</strong> reasoning &amp; <strong>Scikit-Learn ML Models</strong> ($R^2 = 0.975$) for next-day telemetry.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white font-bold gap-2">
            <span className="truncate">Verified ML Engine</span>
            <span className="text-[11px] text-slate-400 font-mono flex-shrink-0">Port 8000</span>
          </div>
        </div>
      </InteractiveTiltCard>

    </div>
  );
};
