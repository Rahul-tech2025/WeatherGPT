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
    <div className="w-full bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-lg">⏱️</span>
          <h2 className="text-base font-bold text-white tracking-tight">24-Hour Hourly Forecast</h2>
        </div>
        <span className="text-xs text-slate-400 font-medium">Scroll horizontally ➔</span>
      </div>

      <div className="flex space-x-3 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-slate-700">
        {hourly.map((item, index) => {
          const isNow = index === 0;
          return (
            <div
              key={item.time}
              className={`flex-shrink-0 flex flex-col items-center justify-between p-3.5 rounded-2xl min-w-[85px] transition-all duration-200 border ${
                isNow
                  ? 'bg-gradient-to-b from-blue-600/30 to-blue-900/20 border-blue-500/40 shadow-lg shadow-blue-500/10'
                  : 'bg-slate-800/40 hover:bg-slate-800/80 border-slate-700/50'
              }`}
            >
              {/* Time */}
              <span className={`text-xs font-semibold ${isNow ? 'text-blue-400 font-bold' : 'text-slate-300'}`}>
                {formatHour(item.time, index)}
              </span>

              {/* Weather Icon */}
              <div className="my-2.5">
                <WeatherIcon icon={item.icon} className="w-7 h-7" />
              </div>

              {/* Temperature */}
              <span className="text-base font-bold text-white">
                {formatTemp(item.temperature)}
              </span>

              {/* Rain Probability Badge */}
              <div className="mt-2 text-[10px] font-semibold flex items-center space-x-0.5 text-sky-400 bg-sky-950/60 px-1.5 py-0.5 rounded-full border border-sky-800/50">
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
