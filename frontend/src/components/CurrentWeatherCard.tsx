'use client';

import React from 'react';
import { CurrentWeather, DailyForecastItem, HourlyForecastItem } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import InteractiveTiltCard from './InteractiveTiltCard';
import RollingNumberTicker from './RollingNumberTicker';

interface CurrentWeatherCardProps {
  cityName: string;
  admin1?: string;
  country?: string;
  current: CurrentWeather;
  todayDaily?: DailyForecastItem;
  unit: 'C' | 'F';
  overrideHourlyItem?: HourlyForecastItem | null;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  cityName,
  admin1,
  country,
  current,
  todayDaily,
  unit,
  overrideHourlyItem,
}) => {
  // Preview values when user is scrubbing timeline
  const displayTempC = overrideHourlyItem ? overrideHourlyItem.temperature : current.temperature;
  const displayFeelsC = overrideHourlyItem ? overrideHourlyItem.feelsLike : current.feelsLike;
  const displayCondition = overrideHourlyItem ? overrideHourlyItem.condition : current.condition;
  const displayIcon = overrideHourlyItem ? overrideHourlyItem.icon : current.icon;
  const displayHumidity = overrideHourlyItem ? overrideHourlyItem.humidity : current.humidity;
  const displayWind = overrideHourlyItem ? overrideHourlyItem.windSpeed : current.windSpeed;
  const displayPressure = overrideHourlyItem ? overrideHourlyItem.pressure : current.pressure;

  const tempVal = unit === 'F' ? (displayTempC * 9) / 5 + 32 : displayTempC;
  const feelsVal = unit === 'F' ? (displayFeelsC * 9) / 5 + 32 : displayFeelsC;

  const highVal = todayDaily
    ? unit === 'F'
      ? (todayDaily.tempMax * 9) / 5 + 32
      : todayDaily.tempMax
    : null;

  const lowVal = todayDaily
    ? unit === 'F'
      ? (todayDaily.tempMin * 9) / 5 + 32
      : todayDaily.tempMin
    : null;

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return '--:--';
    try {
      const d = new Date(timeStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return timeStr;
    }
  };

  return (
    <InteractiveTiltCard maxTilt={5} glareOpacity={0.30} scaleOnHover={1.008}>
      <div className="w-full rounded-[2.5rem] p-7 sm:p-10 backdrop-blur-3xl bg-[#080c14]/90 border border-white/[0.12] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] relative overflow-hidden transition-all duration-500">
        
        {/* Space Monochromatic Ambient Orbs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/[0.04] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/[0.02] rounded-full blur-[100px] pointer-events-none" />

        {/* Top Bar: Location & Header Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 relative z-10">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="flex h-2.5 w-2.5 rounded-full bg-white shadow-sm shadow-white/50" />
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {cityName}
              </h1>
              {country && (
                <span className="px-2 py-0.5 text-[11px] font-bold tracking-wider uppercase rounded-md bg-white/[0.08] text-slate-300 border border-white/10 font-mono">
                  {country}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
              {[admin1, country].filter(Boolean).join(', ')} •{' '}
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>

          {/* Time Scrubber Status Badge or Day/Night Pill with Clean SVGs */}
          <div className="flex items-center space-x-2 self-start sm:self-auto">
            {overrideHourlyItem ? (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20 backdrop-blur-md shadow-inner animate-pulse">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>
                  Preview: {new Date(overrideHourlyItem.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/[0.06] text-slate-200 border border-white/15 backdrop-blur-md shadow-inner">
                {current.isDay ? (
                  <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
                <span className="tracking-tight">
                  {current.isDay ? 'Day Horizon' : 'Night Sky'}
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Main Temperature & Weather Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 items-center relative z-10">
          {/* Left: Giant Crisp Temperature Display with Rolling Digits (7 cols) */}
          <div className="lg:col-span-7 flex items-center space-x-6 sm:space-x-8">
            <div className="p-4 sm:p-5 bg-white/[0.04] rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl relative group">
              <div className="absolute inset-0 bg-white/5 rounded-3xl blur group-hover:bg-white/10 transition-all duration-300" />
              <WeatherIcon
                icon={displayIcon}
                className="w-20 h-20 sm:w-28 sm:h-28 relative z-10 filter drop-shadow-xl"
                isDay={current.isDay}
              />
            </div>
            <div>
              <div className="flex items-baseline">
                <span className="text-7xl sm:text-8xl md:text-9xl font-extralight tracking-tighter text-white">
                  <RollingNumberTicker value={tempVal} decimals={0} />
                </span>
                <span className="text-4xl sm:text-5xl font-light text-slate-300 ml-1">
                  °{unit}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {displayCondition}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-white/[0.08] text-slate-300 border border-white/10 font-medium">
                  Feels like <RollingNumberTicker value={feelsVal} decimals={0} suffix={`°${unit}`} />
                </span>
              </div>
            </div>
          </div>

          {/* Right: Microclimate Telemetry Capsules (5 cols) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3 p-4 rounded-3xl bg-black/40 border border-white/[0.08] backdrop-blur-2xl shadow-inner">
            {/* Today High */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition-all">
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                <span>Peak Temp</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
              </div>
              <div className="text-lg sm:text-xl font-black text-white">
                {highVal !== null ? (
                  <RollingNumberTicker value={highVal} decimals={0} suffix={`°${unit}`} />
                ) : (
                  '--'
                )}
              </div>
              <span className="text-[10px] text-slate-400">Solar zenith</span>
            </div>

            {/* Today Low */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition-all">
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                <span>Low Temp</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              </div>
              <div className="text-lg sm:text-xl font-black text-white">
                {lowVal !== null ? (
                  <RollingNumberTicker value={lowVal} decimals={0} suffix={`°${unit}`} />
                ) : (
                  '--'
                )}
              </div>
              <span className="text-[10px] text-slate-400">Nocturnal low</span>
            </div>

            {/* Sunrise */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition-all">
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                <span>Sunrise</span>
                <svg className="w-3.5 h-3.5 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v6M4.93 4.93l4.24 4.24M2 18h20M20 18a8 8 0 0 0-16 0" />
                </svg>
              </div>
              <div className="text-sm sm:text-base font-bold text-white">
                {formatTime(todayDaily?.sunrise)}
              </div>
              <span className="text-[10px] text-slate-400">Dawn horizon</span>
            </div>

            {/* Sunset */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition-all">
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                <span>Sunset</span>
                <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 10v6M4.93 10.93l4.24-4.24M2 18h20M20 18a8 8 0 0 0-16 0" />
                </svg>
              </div>
              <div className="text-sm sm:text-base font-bold text-white">
                {formatTime(todayDaily?.sunset)}
              </div>
              <span className="text-[10px] text-slate-400">Dusk horizon</span>
            </div>
          </div>
        </div>

        {/* Bottom Telemetry Ticker (Monochrome Clean SVGs) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 border-t border-white/[0.08] relative z-10">
          <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
            <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-white text-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                Humidity
              </span>
              <span className="text-white font-extrabold text-sm sm:text-base">
                <RollingNumberTicker value={displayHumidity} decimals={0} suffix="%" />
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
            <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-white text-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
              </svg>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                Wind Speed
              </span>
              <span className="text-white font-extrabold text-sm sm:text-base">
                <RollingNumberTicker value={displayWind} decimals={0} suffix=" km/h" />
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
            <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-white text-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" />
              </svg>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                Air Pressure
              </span>
              <span className="text-white font-extrabold text-sm sm:text-base">
                <RollingNumberTicker value={displayPressure} decimals={0} suffix=" hPa" />
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
            <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-white text-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                UV Max Index
              </span>
              <span className="text-white font-extrabold text-sm sm:text-base">
                {todayDaily?.uvIndexMax ?? 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </InteractiveTiltCard>
  );
};
