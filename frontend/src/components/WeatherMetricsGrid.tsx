'use strict';
'use client';

import React from 'react';
import { CurrentWeather, DailyForecastItem } from '../types/weather';

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
    if (uv <= 2) return { text: 'Low', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40', percent: 20, tip: 'No protection needed' };
    if (uv <= 5) return { text: 'Moderate', color: 'text-amber-400 border-amber-500/30 bg-amber-950/40', percent: 45, tip: 'Wear sunglasses & hat' };
    if (uv <= 7) return { text: 'High', color: 'text-orange-400 border-orange-500/30 bg-orange-950/40', percent: 70, tip: 'Apply SPF 30+ sunscreen' };
    if (uv <= 10) return { text: 'Very High', color: 'text-rose-400 border-rose-500/30 bg-rose-950/40', percent: 88, tip: 'Avoid midday sun' };
    return { text: 'Extreme', color: 'text-purple-400 border-purple-500/30 bg-purple-950/40', percent: 100, tip: 'Stay indoors if possible' };
  };

  const uvInfo = getUvLevel(todayDaily?.uvIndexMax ?? 2);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5 w-full">
      
      {/* 1. Wind & Dynamic Compass */}
      <div className="glass-card rounded-[2rem] p-6 relative overflow-hidden group">
        <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">
          <span className="flex items-center space-x-2">
            <span className="text-emerald-400">💨</span>
            <span className="text-slate-300">Surface Wind</span>
          </span>
          <span className="text-[10px] bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 px-2.5 py-0.5 rounded-full font-bold">
            {getWindDirectionCompass(current.windDirection)} ({current.windDirection}°)
          </span>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-4xl font-black text-white tracking-tight">{current.windSpeed}</span>
          <span className="text-slate-400 text-sm font-semibold">km/h</span>
        </div>
        <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between text-xs text-slate-400">
          <span>Max Gust Today</span>
          <strong className="text-slate-200">{todayDaily?.windSpeedMax ?? current.windSpeed} km/h</strong>
        </div>
      </div>

      {/* 2. Humidity & Gauge */}
      <div className="glass-card rounded-[2rem] p-6 relative overflow-hidden group">
        <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">
          <span className="flex items-center space-x-2">
            <span className="text-blue-400">💧</span>
            <span className="text-slate-300">Relative Humidity</span>
          </span>
          <span className="text-[10px] bg-blue-950/60 text-blue-300 border border-blue-800/40 px-2.5 py-0.5 rounded-full font-bold">
            {current.humidity > 70 ? 'High' : current.humidity < 35 ? 'Dry' : 'Ideal'}
          </span>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-4xl font-black text-white tracking-tight">{current.humidity}%</span>
        </div>
        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-900 rounded-full mt-3 overflow-hidden border border-white/[0.06]">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
            style={{ width: `${current.humidity}%` }}
          />
        </div>
        <div className="mt-3 pt-2 border-t border-white/[0.04] flex items-center justify-between text-xs text-slate-400">
          <span>Dew Point Index</span>
          <strong className="text-slate-200">Feels like {Math.round(current.feelsLike)}°C</strong>
        </div>
      </div>

      {/* 3. UV Index */}
      <div className="glass-card rounded-[2rem] p-6 relative overflow-hidden group">
        <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">
          <span className="flex items-center space-x-2">
            <span className="text-amber-400">☀️</span>
            <span className="text-slate-300">Solar UV Index</span>
          </span>
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${uvInfo.color}`}>
            {uvInfo.text}
          </span>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-4xl font-black text-white tracking-tight">{todayDaily?.uvIndexMax ?? '1.5'}</span>
          <span className="text-slate-500 text-sm font-semibold">/ 12</span>
        </div>
        {/* UV meter */}
        <div className="w-full h-1.5 bg-slate-900 rounded-full mt-3 overflow-hidden border border-white/[0.06]">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 rounded-full"
            style={{ width: `${uvInfo.percent}%` }}
          />
        </div>
        <div className="mt-3 pt-2 border-t border-white/[0.04] text-xs text-slate-400 truncate">
          💡 {uvInfo.tip}
        </div>
      </div>

      {/* 4. Atmospheric Pressure */}
      <div className="glass-card rounded-[2rem] p-6 relative overflow-hidden group">
        <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">
          <span className="flex items-center space-x-2">
            <span className="text-purple-400">🧭</span>
            <span className="text-slate-300">Barometric Pressure</span>
          </span>
          <span className="text-[10px] bg-purple-950/60 text-purple-300 border border-purple-800/40 px-2.5 py-0.5 rounded-full font-bold">
            {current.pressure > 1013 ? 'High' : 'Normal'}
          </span>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-4xl font-black text-white tracking-tight">{Math.round(current.pressure)}</span>
          <span className="text-slate-400 text-sm font-semibold">hPa</span>
        </div>
        <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between text-xs text-slate-400">
          <span>Sea-Level Standard</span>
          <strong className="text-slate-200">1013.25 hPa</strong>
        </div>
      </div>

      {/* 5. Precipitation Sum */}
      <div className="glass-card rounded-[2rem] p-6 relative overflow-hidden group">
        <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">
          <span className="flex items-center space-x-2">
            <span className="text-cyan-400">🌧️</span>
            <span className="text-slate-300">Precipitation Accumulation</span>
          </span>
          <span className="text-[10px] bg-cyan-950/60 text-cyan-300 border border-cyan-800/40 px-2.5 py-0.5 rounded-full font-bold">
            {current.precipitation > 0 ? 'Active Rain' : 'Dry'}
          </span>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-4xl font-black text-white tracking-tight">{current.precipitation}</span>
          <span className="text-slate-400 text-sm font-semibold">mm/h</span>
        </div>
        <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between text-xs text-slate-400">
          <span>Total Expected Today</span>
          <strong className="text-cyan-300">{todayDaily?.precipitationSum ?? 0} mm</strong>
        </div>
      </div>

      {/* 6. Dual AI Architecture Badge */}
      <div className="rounded-[2rem] p-6 bg-gradient-to-br from-blue-900/40 via-indigo-950/40 to-slate-900/60 border border-blue-500/30 backdrop-blur-2xl shadow-xl relative overflow-hidden group">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
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
          Powered by <strong>Google Gemini</strong> for grounded conversational guidance &amp; <strong>Scikit-Learn ML Models</strong> ($R^2 = 0.975$) for next-day telemetry.
        </p>
        <div className="mt-3.5 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs text-cyan-400 font-bold">
          <span>Independent ML Engine</span>
          <span className="text-[11px] text-slate-400">Jalandhar Climate</span>
        </div>
      </div>

    </div>
  );
};
