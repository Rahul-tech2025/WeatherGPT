'use strict';
'use client';

import React from 'react';
import { DailyForecastItem } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';

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

  // Find min and max across all 7 days for relative temp bar scaling
  const allMins = daily.map(d => d.tempMin);
  const allMaxs = daily.map(d => d.tempMax);
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const range = globalMax - globalMin || 1;

  return (
    <div className="w-full bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-lg">📅</span>
          <h2 className="text-base font-bold text-white tracking-tight">7-Day Forecast</h2>
        </div>
        <span className="text-xs text-slate-400 font-medium">Daily Highs & Lows</span>
      </div>

      <div className="divide-y divide-slate-800/80">
        {daily.map((item, index) => {
          const isToday = index === 0;

          // Calculate bar percentage
          const leftPercent = Math.max(0, ((item.tempMin - globalMin) / range) * 100);
          const barWidth = Math.max(15, ((item.tempMax - item.tempMin) / range) * 100);

          return (
            <div
              key={item.date}
              className={`py-3.5 flex items-center justify-between gap-3 text-sm transition-colors ${
                isToday ? 'bg-blue-600/5 px-2 rounded-xl' : 'hover:bg-slate-800/30 px-2 rounded-xl'
              }`}
            >
              {/* Day Name */}
              <div className="w-20 font-semibold text-slate-200 flex items-center space-x-1.5">
                <span className={isToday ? 'text-blue-400 font-bold' : ''}>
                  {formatDayName(item.date, index)}
                </span>
                {isToday && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                )}
              </div>

              {/* Weather Icon & Condition */}
              <div className="flex items-center space-x-3 w-40">
                <WeatherIcon icon={item.icon} className="w-6 h-6 flex-shrink-0" />
                <span className="text-xs text-slate-300 truncate hidden sm:inline">
                  {item.condition}
                </span>
              </div>

              {/* Rain Chance */}
              <div className="w-16 text-right">
                {item.precipitationProbabilityMax > 0 ? (
                  <span className="text-xs font-semibold text-sky-400 flex items-center justify-end space-x-0.5">
                    <span>💧</span>
                    <span>{item.precipitationProbabilityMax}%</span>
                  </span>
                ) : (
                  <span className="text-xs text-slate-500">—</span>
                )}
              </div>

              {/* Temperature Bar Visualizer */}
              <div className="flex-1 max-w-[200px] flex items-center space-x-2">
                <span className="text-xs text-slate-400 font-medium w-8 text-right">
                  {formatTemp(item.tempMin)}
                </span>

                <div className="flex-1 h-2 bg-slate-800 rounded-full relative overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-blue-500 via-amber-400 to-rose-500"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${barWidth}%`
                    }}
                  />
                </div>

                <span className="text-xs text-white font-bold w-8 text-left">
                  {formatTemp(item.tempMax)}
                </span>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
