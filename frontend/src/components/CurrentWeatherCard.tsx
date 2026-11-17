'use strict';
'use client';

import React from 'react';
import { CurrentWeather, DailyForecastItem } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherCardProps {
  cityName: string;
  admin1?: string;
  country?: string;
  current: CurrentWeather;
  todayDaily?: DailyForecastItem;
  unit: 'C' | 'F';
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  cityName,
  admin1,
  country,
  current,
  todayDaily,
  unit
}) => {
  const formatTemp = (tempC: number) => {
    if (unit === 'F') {
      return `${Math.round((tempC * 9) / 5 + 32)}°`;
    }
    return `${Math.round(tempC)}°`;
  };

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return '--:--';
    try {
      const d = new Date(timeStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return timeStr;
    }
  };

  // Weather-specific card background gradient & accent orbs
  const getAtmosphericGlow = () => {
    if (!current.isDay) {
      return {
        cardBg: 'from-slate-900/90 via-indigo-950/40 to-slate-950/90 border-indigo-500/20',
        orb1: 'bg-indigo-600/20',
        orb2: 'bg-blue-600/15'
      };
    }
    switch (current.category) {
      case 'Clear':
        return {
          cardBg: 'from-slate-900/90 via-sky-950/30 to-slate-950/90 border-sky-400/25',
          orb1: 'bg-amber-500/15',
          orb2: 'bg-sky-500/20'
        };
      case 'Rain':
      case 'Drizzle':
        return {
          cardBg: 'from-slate-900/90 via-blue-950/40 to-slate-950/90 border-blue-500/20',
          orb1: 'bg-cyan-600/20',
          orb2: 'bg-blue-700/20'
        };
      case 'Thunderstorm':
        return {
          cardBg: 'from-slate-900/90 via-purple-950/40 to-slate-950/90 border-purple-500/30',
          orb1: 'bg-purple-600/25',
          orb2: 'bg-indigo-700/20'
        };
      case 'Snow':
        return {
          cardBg: 'from-slate-900/90 via-cyan-950/30 to-slate-950/90 border-cyan-400/25',
          orb1: 'bg-cyan-400/20',
          orb2: 'bg-blue-400/15'
        };
      default:
        return {
          cardBg: 'from-slate-900/90 via-slate-800/40 to-slate-950/90 border-slate-700/40',
          orb1: 'bg-blue-500/15',
          orb2: 'bg-cyan-500/15'
        };
    }
  };

  const glow = getAtmosphericGlow();

  return (
    <div className={`w-full rounded-[2rem] p-7 sm:p-10 backdrop-blur-2xl bg-gradient-to-br ${glow.cardBg} border shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] relative overflow-hidden transition-all duration-500`}>
      
      {/* Dynamic Background Ambient Glowing Orbs */}
      <div className={`absolute -top-32 -right-32 w-96 h-96 ${glow.orb1} rounded-full blur-[100px] pointer-events-none transition-all duration-700`} />
      <div className={`absolute -bottom-32 -left-32 w-96 h-96 ${glow.orb2} rounded-full blur-[100px] pointer-events-none transition-all duration-700`} />

      {/* Top Bar: Location & Header Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 relative z-10">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {cityName}
            </h1>
            {country && (
              <span className="px-2 py-0.5 text-[11px] font-bold tracking-wider uppercase rounded-md bg-white/[0.08] text-slate-300 border border-white/10">
                {country}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
            {[admin1, country].filter(Boolean).join(', ')} • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
        </div>

        {/* Day/Night Pill with Status Glow */}
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/[0.06] text-slate-200 border border-white/15 backdrop-blur-md shadow-inner">
            <span>{current.isDay ? '☀️' : '🌙'}</span>
            <span className="tracking-tight">{current.isDay ? 'Day Conditions' : 'Night Sky'}</span>
          </span>
        </div>
      </div>

      {/* Main Temperature & Weather Hero Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 items-center relative z-10">
        
        {/* Left: Giant Crisp Temperature Display (7 cols) */}
        <div className="lg:col-span-7 flex items-center space-x-6 sm:space-x-8">
          <div className="p-4 sm:p-5 bg-white/[0.04] rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl relative group">
            <div className="absolute inset-0 bg-blue-500/10 rounded-3xl blur group-hover:bg-blue-500/20 transition-all duration-300" />
            <WeatherIcon icon={current.icon} className="w-20 h-20 sm:w-28 sm:h-28 relative z-10 filter drop-shadow-xl" isDay={current.isDay} />
          </div>
          <div>
            <div className="flex items-baseline">
              <span className="text-7xl sm:text-8xl md:text-9xl font-extralight tracking-tighter text-white">
                {formatTemp(current.temperature).replace('°', '')}
              </span>
              <span className="text-4xl sm:text-5xl font-light text-cyan-400 ml-1">
                °{unit}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">
                {current.condition}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-white/[0.08] text-slate-300 border border-white/10 font-medium">
                Feels like {formatTemp(current.feelsLike)}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Microclimate Telemetry Capsules (5 cols) */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-3 p-4 rounded-3xl bg-slate-950/40 border border-white/[0.08] backdrop-blur-2xl shadow-inner">
          
          {/* Today High */}
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition-all">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
              <span>Day High</span>
              <span className="w-2 h-2 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50" />
            </div>
            <div className="text-lg sm:text-xl font-black text-white">
              {todayDaily ? formatTemp(todayDaily.tempMax) : '--'}
            </div>
            <span className="text-[10px] text-slate-400">Peak expected</span>
          </div>

          {/* Today Low */}
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition-all">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
              <span>Day Low</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
            </div>
            <div className="text-lg sm:text-xl font-black text-white">
              {todayDaily ? formatTemp(todayDaily.tempMin) : '--'}
            </div>
            <span className="text-[10px] text-slate-400">Overnight low</span>
          </div>

          {/* Sunrise */}
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition-all">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
              <span>Sunrise</span>
              <span className="text-amber-400 text-xs">🌅</span>
            </div>
            <div className="text-sm sm:text-base font-bold text-white">
              {formatTime(todayDaily?.sunrise)}
            </div>
            <span className="text-[10px] text-slate-400">Dawn telemetry</span>
          </div>

          {/* Sunset */}
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition-all">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
              <span>Sunset</span>
              <span className="text-indigo-400 text-xs">🌇</span>
            </div>
            <div className="text-sm sm:text-base font-bold text-white">
              {formatTime(todayDaily?.sunset)}
            </div>
            <span className="text-[10px] text-slate-400">Dusk telemetry</span>
          </div>

        </div>

      </div>

      {/* Bottom Telemetry Ticker */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 border-t border-white/[0.08] relative z-10">
        
        <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-sm">
            💧
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Humidity</span>
            <span className="text-white font-extrabold text-sm sm:text-base">{current.humidity}%</span>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm">
            💨
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Wind Speed</span>
            <span className="text-white font-extrabold text-sm sm:text-base">{current.windSpeed} <span className="text-xs font-normal text-slate-400">km/h</span></span>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 text-sm">
            🧭
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Air Pressure</span>
            <span className="text-white font-extrabold text-sm sm:text-base">{current.pressure} <span className="text-xs font-normal text-slate-400">hPa</span></span>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-sm">
            ☀️
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">UV Max Index</span>
            <span className="text-white font-extrabold text-sm sm:text-base">{todayDaily?.uvIndexMax ?? 'N/A'}</span>
          </div>
        </div>

      </div>

    </div>
  );
};
