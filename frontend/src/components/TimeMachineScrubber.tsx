'use client';

import React from 'react';
import { HourlyForecastItem } from '../types/weather';
import RollingNumberTicker from './RollingNumberTicker';

interface TimeMachineScrubberProps {
  hourly: HourlyForecastItem[];
  unit: 'C' | 'F';
  onSelectHour: (item: HourlyForecastItem | null, hourIndex: number | null) => void;
  selectedHourIndex: number | null;
}

export default function TimeMachineScrubber({
  hourly,
  unit,
  onSelectHour,
  selectedHourIndex,
}: TimeMachineScrubberProps) {
  // If hourly is empty, return null
  if (!hourly || hourly.length === 0) return null;

  // We display the first 24 hours
  const hours24 = hourly.slice(0, 24);

  const activeIndex = selectedHourIndex !== null ? selectedHourIndex : 0;
  const isLive = selectedHourIndex === null;
  const activeItem = hours24[activeIndex] || hours24[0];

  const formatHourLabel = (timeStr: string) => {
    const d = new Date(timeStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const getTimePeriod = (timeStr: string) => {
    const d = new Date(timeStr);
    const hr = d.getHours();
    if (hr >= 5 && hr < 8) return { label: 'Dawn Horizon', emoji: '🌅', color: 'from-amber-500/20 to-rose-500/20' };
    if (hr >= 8 && hr < 17) return { label: 'Daylight Solar', emoji: '☀️', color: 'from-blue-500/20 to-cyan-500/20' };
    if (hr >= 17 && hr < 20) return { label: 'Golden Sunset', emoji: '🌇', color: 'from-orange-500/20 to-purple-500/20' };
    return { label: 'Cosmic Night', emoji: '🌙', color: 'from-indigo-600/20 to-purple-900/20' };
  };

  const period = getTimePeriod(activeItem.time);

  const temp = unit === 'C'
    ? activeItem.temperature
    : (activeItem.temperature * 9) / 5 + 32;

  const feelsLike = unit === 'C'
    ? activeItem.feelsLike
    : (activeItem.feelsLike * 9) / 5 + 32;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const idx = parseInt(e.target.value, 10);
    onSelectHour(hours24[idx], idx);
  };

  const handleResetLive = () => {
    onSelectHour(null, null);
  };

  return (
    <div className="w-full glass-card rounded-[2rem] p-5 sm:p-6 border border-white/[0.08] relative overflow-hidden backdrop-blur-2xl">
      {/* Background Time Glow based on period */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${period.color} opacity-40 blur-2xl -z-10 pointer-events-none transition-colors duration-700`}
      />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-400/25 flex items-center justify-center text-sm shadow-inner">
            ⏳
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-black text-white tracking-tight">
                24-Hour Atmospheric Time Scrubber
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 font-mono font-bold border border-cyan-400/20">
                INTERACTIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Scrub the timeline to preview hourly solar trajectory &amp; temperature transitions
            </p>
          </div>
        </div>

        {/* Live Snap Button */}
        <button
          onClick={handleResetLive}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-md ${
            isLive
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-emerald-500/20'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 hover:text-white'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
          <span>{isLive ? 'Live Now' : 'Reset to Live'}</span>
        </button>
      </div>

      {/* Active Scrubbed Hour Telemetry Pill */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/70 border border-white/[0.06] mb-5">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{period.emoji}</span>
          <div>
            <div className="text-xs font-extrabold text-white flex items-center space-x-2">
              <span>{formatHourLabel(activeItem.time)}</span>
              <span className="text-slate-500">•</span>
              <span className="text-cyan-300">{period.label}</span>
            </div>
            <div className="text-[11px] text-slate-400">{activeItem.condition}</div>
          </div>
        </div>

        <div className="flex items-baseline space-x-3 text-right">
          <div>
            <div className="text-xl font-black text-white">
              <RollingNumberTicker value={temp} decimals={0} suffix={`°${unit}`} />
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              Feels <RollingNumberTicker value={feelsLike} decimals={0} suffix={`°${unit}`} />
            </div>
          </div>
          <div className="border-l border-white/10 pl-3 hidden sm:block">
            <div className="text-xs font-bold text-blue-300">{activeItem.precipitationProbability}% Rain</div>
            <div className="text-[10px] text-slate-400">{activeItem.windSpeed} km/h Wind</div>
          </div>
        </div>
      </div>

      {/* Timeline Range Slider */}
      <div className="space-y-2">
        <input
          type="range"
          min="0"
          max={hours24.length - 1}
          value={activeIndex}
          onChange={handleSliderChange}
          aria-label="24-Hour Time Scrubber"
          className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 shadow-inner"
        />

        {/* Micro Hour Labels */}
        <div className="flex justify-between text-[10px] font-mono text-slate-500 px-1 select-none">
          <span>{formatHourLabel(hours24[0].time)}</span>
          <span className="hidden sm:inline">{formatHourLabel(hours24[Math.floor(hours24.length * 0.25)].time)}</span>
          <span>{formatHourLabel(hours24[Math.floor(hours24.length * 0.5)].time)}</span>
          <span className="hidden sm:inline">{formatHourLabel(hours24[Math.floor(hours24.length * 0.75)].time)}</span>
          <span>{formatHourLabel(hours24[hours24.length - 1].time)}</span>
        </div>
      </div>
    </div>
  );
}
