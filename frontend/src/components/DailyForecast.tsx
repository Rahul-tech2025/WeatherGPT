'use strict';
'use client';

import React from 'react';
import { DailyForecastItem } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import InteractiveTiltCard from './InteractiveTiltCard';

interface DailyForecastProps {
  daily: DailyForecastItem[];
  unit: 'C' | 'F';
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ daily, unit }) => {
  const formatTemp = (tempC: number) => {
    if (unit === 'F') {
      return `${Math.round((tempC * 9) / 5 + 32)}°`;
    }
    return `${Math.round(tempC)}°`;
  };

  const formatDayName = (dateStr: string, index: number) => {
    if (index === 0) return 'Today';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { weekday: 'short' });
    } catch {
      return dateStr;
    }
  };

  if (!daily || daily.length === 0) return null;

  // Global scale for temperature bar
  const allMins = daily.map(d => d.tempMin);
  const allMaxs = daily.map(d => d.tempMax);
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const range = globalMax - globalMin || 1;

  return (
    <InteractiveTiltCard maxTilt={4} glareOpacity={0.28} scaleOnHover={1.006}>
      <div className="w-full glass-card rounded-[2rem] p-6 sm:p-7 relative overflow-hidden bg-[#080c14]/85 border border-white/[0.10]">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-white text-sm">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">7-Day Outlook</h2>
            <p className="text-[11px] text-slate-400 font-medium">Weekly synoptic progression &amp; min/max spread</p>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 bg-white/[0.06] px-2.5 py-1 rounded-full border border-white/10 font-mono">
          Normalized Spread
        </span>
      </div>

      <div className="divide-y divide-white/[0.04]">
        {daily.map((item, index) => {
          const isToday = index === 0;
          const leftPercent = Math.max(0, ((item.tempMin - globalMin) / range) * 100);
          const barWidth = Math.max(16, ((item.tempMax - item.tempMin) / range) * 100);

          return (
            <div
              key={item.date}
              className={`py-3.5 px-3 flex items-center justify-between gap-4 text-sm rounded-2xl transition-all duration-200 ${
                isToday 
                  ? 'bg-blue-600/[0.08] border border-blue-500/20 shadow-sm' 
                  : 'hover:bg-white/[0.03]'
              }`}
            >
              {/* Day Name */}
              <div className="w-20 font-bold text-slate-200 flex items-center space-x-2">
                <span className={isToday ? 'text-cyan-300 font-black' : 'text-slate-300'}>
                  {formatDayName(item.date, index)}
                </span>
                {isToday && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
                )}
              </div>

              {/* Weather Icon & Condition */}
              <div className="flex items-center space-x-3 w-36 sm:w-44">
                <WeatherIcon icon={item.icon} className="w-7 h-7 flex-shrink-0 filter drop-shadow" />
                <span className="text-xs text-slate-300 font-medium truncate hidden sm:inline">
                  {item.condition}
                </span>
              </div>

              {/* Precipitation Probability */}
              <div className="w-16 text-right">
                {item.precipitationProbabilityMax > 0 ? (
                  <span className="text-xs font-bold text-cyan-400 flex items-center justify-end space-x-1">
                    <span className="text-[10px]">💧</span>
                    <span>{item.precipitationProbabilityMax}%</span>
                  </span>
                ) : (
                  <span className="text-xs text-slate-600 font-mono">—</span>
                )}
              </div>

              {/* High-End Temperature Range Bar (Apple Weather Style) */}
              <div className="flex-1 max-w-[220px] flex items-center space-x-2.5">
                <span className="text-xs text-slate-400 font-semibold w-8 text-right font-mono">
                  {formatTemp(item.tempMin)}
                </span>

                <div className="flex-1 h-2 bg-slate-900/90 rounded-full relative overflow-hidden border border-white/[0.06] shadow-inner">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-cyan-400 via-amber-300 to-rose-400 shadow-sm"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${barWidth}%`
                    }}
                  />
                </div>

                <span className="text-xs text-white font-black w-8 text-left font-mono">
                  {formatTemp(item.tempMax)}
                </span>
              </div>

            </div>
          );
        })}
      </div>
    </div>
    </InteractiveTiltCard>
  );
};
