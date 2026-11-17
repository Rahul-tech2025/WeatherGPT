'use strict';
'use client';

import React from 'react';
import { HourlyForecastItem } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';

interface HourlyForecastProps {
  hourly: HourlyForecastItem[];
  unit: 'C' | 'F';
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourly, unit }) => {
  const formatTemp = (tempC: number) => {
    if (unit === 'F') {
      return `${Math.round((tempC * 9) / 5 + 32)}°`;
    }
    return `${Math.round(tempC)}°`;
  };

  const formatHour = (isoTime: string, index: number) => {
    if (index === 0) return 'Now';
    try {
      const d = new Date(isoTime);
      return d.toLocaleTimeString([], { hour: 'numeric' });
    } catch {
      return isoTime.slice(11, 16);
    }
  };

  if (!hourly || hourly.length === 0) return null;

  return (
    <div className="w-full glass-card rounded-[2rem] p-6 sm:p-7 relative overflow-hidden">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-sm">
            ⏱️
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">24-Hour Horizon</h2>
            <p className="text-[11px] text-slate-400 font-medium">Hourly atmospheric trend & precipitation</p>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-cyan-400/80 bg-cyan-950/40 px-2.5 py-1 rounded-full border border-cyan-800/30">
          Scroll ➔
        </span>
      </div>

      <div className="flex space-x-3.5 overflow-x-auto pb-3 pt-1 scrollbar-thin">
        {hourly.map((item, index) => {
          const isNow = index === 0;
          return (
            <div
              key={item.time}
              className={`flex-shrink-0 flex flex-col items-center justify-between p-4 rounded-2xl min-w-[92px] transition-all duration-300 border ${
                isNow
                  ? 'bg-gradient-to-b from-blue-600/30 via-indigo-600/20 to-slate-900/60 border-blue-500/50 shadow-lg shadow-blue-500/20 ring-1 ring-white/10'
                  : 'bg-white/[0.02] hover:bg-white/[0.06] border-white/[0.06] hover:border-white/15'
              }`}
            >
              {/* Hour Label */}
              <span className={`text-xs font-bold ${isNow ? 'text-cyan-300' : 'text-slate-400'}`}>
                {formatHour(item.time, index)}
              </span>

              {/* Icon with soft glow */}
              <div className="my-3 filter drop-shadow">
                <WeatherIcon icon={item.icon} className="w-8 h-8" />
              </div>

              {/* Temperature */}
              <span className="text-lg font-black text-white tracking-tight">
                {formatTemp(item.temperature)}
              </span>

              {/* Rain Probability Pill */}
              <div className={`mt-2.5 text-[10px] font-bold flex items-center space-x-1 px-2 py-0.5 rounded-full border ${
                item.precipitationProbability > 20
                  ? 'text-cyan-300 bg-cyan-950/60 border-cyan-700/50'
                  : 'text-slate-500 bg-slate-900/60 border-white/[0.04]'
              }`}>
                <span>💧</span>
                <span>{item.precipitationProbability}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
