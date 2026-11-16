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
      return `${Math.round((tempC * 9) / 5 + 32)}°F`;
    }
    return `${Math.round(tempC)}°C`;
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

  // Weather-specific card background gradient
  const getGradient = () => {
    if (!current.isDay) {
      return 'from-indigo-950/70 via-slate-900/80 to-slate-950/90 border-indigo-500/20';
    }
    switch (current.category) {
      case 'Clear':
        return 'from-sky-900/40 via-blue-950/60 to-slate-950/90 border-sky-500/30';
      case 'Rain':
      case 'Drizzle':
        return 'from-blue-950/60 via-slate-900/70 to-slate-950/90 border-blue-500/20';
      case 'Thunderstorm':
        return 'from-purple-950/50 via-slate-900/70 to-slate-950/90 border-purple-500/30';
      case 'Snow':
        return 'from-cyan-950/40 via-slate-900/60 to-slate-950/90 border-cyan-500/20';
      default:
        return 'from-slate-900/60 via-slate-900/70 to-slate-950/90 border-slate-700/50';
    }
  };

  return (
    <div className={`w-full rounded-3xl p-6 sm:p-8 backdrop-blur-xl bg-gradient-to-br ${getGradient()} border shadow-2xl relative overflow-hidden transition-all duration-300`}>
      
      {/* Background Ambient Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: Location & Current Time */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 relative z-10">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xl">📍</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {cityName}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            {[admin1, country].filter(Boolean).join(', ')} • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/15 backdrop-blur-md">
            {current.isDay ? '☀️ Day Time' : '🌙 Night Time'}
          </span>
        </div>
      </div>

      {/* Main Temperature & Weather Icon Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8 items-center relative z-10">
        
        {/* Left: Giant Temperature */}
        <div className="flex items-center space-x-6">
          <div className="p-3 bg-white/5 rounded-3xl border border-white/10 shadow-inner">
            <WeatherIcon icon={current.icon} className="w-20 h-20 sm:w-24 sm:h-24" isDay={current.isDay} />
          </div>
          <div>
            <div className="text-6xl sm:text-7xl font-black text-white tracking-tighter">
              {formatTemp(current.temperature)}
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-base sm:text-lg font-semibold text-slate-200">
                {current.condition}
              </span>
              <span className="text-xs text-slate-400">
                (Feels like {formatTemp(current.feelsLike)})
              </span>
            </div>
          </div>
        </div>

        {/* Right: Today's High/Low & Sun summary */}
        <div className="grid grid-cols-2 gap-3 bg-slate-900/60 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
          <div className="flex items-center space-x-3 p-2 rounded-xl bg-slate-800/40">
            <span className="text-2xl">🔺</span>
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Today High</div>
              <div className="text-sm font-bold text-white">
                {todayDaily ? formatTemp(todayDaily.tempMax) : '--'}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-2 rounded-xl bg-slate-800/40">
            <span className="text-2xl">🔻</span>
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Today Low</div>
              <div className="text-sm font-bold text-white">
                {todayDaily ? formatTemp(todayDaily.tempMin) : '--'}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-2 rounded-xl bg-slate-800/40">
            <span className="text-2xl">🌅</span>
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Sunrise</div>
              <div className="text-sm font-bold text-white">
                {formatTime(todayDaily?.sunrise)}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-2 rounded-xl bg-slate-800/40">
            <span className="text-2xl">🌇</span>
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Sunset</div>
              <div className="text-sm font-bold text-white">
                {formatTime(todayDaily?.sunset)}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Quick Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 relative z-10 text-xs">
        <div className="flex items-center space-x-2.5">
          <span className="text-blue-400 text-lg">💧</span>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Humidity</span>
            <span className="text-white font-bold text-sm">{current.humidity}%</span>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <span className="text-emerald-400 text-lg">💨</span>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Wind</span>
            <span className="text-white font-bold text-sm">{current.windSpeed} km/h</span>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <span className="text-purple-400 text-lg">🧭</span>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Pressure</span>
            <span className="text-white font-bold text-sm">{current.pressure} hPa</span>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <span className="text-amber-400 text-lg">☀️</span>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">UV Index Max</span>
            <span className="text-white font-bold text-sm">{todayDaily?.uvIndexMax ?? 'N/A'}</span>
          </div>
        </div>
      </div>

    </div>
  );
};
