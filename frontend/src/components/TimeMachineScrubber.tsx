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
  if (!hourly || hourly.length === 0) return null;

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
    if (hr >= 5 && hr < 8) {
      return {
        label: 'Dawn Horizon',
        icon: (
          <svg className="w-5 h-5 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v6M4.93 4.93l4.24 4.24M2 18h20M20 18a8 8 0 0 0-16 0" />
          </svg>
        ),
      };
    }
    if (hr >= 8 && hr < 17) {
      return {
        label: 'Daylight Zenith',
        icon: (
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
          </svg>
        ),
      };
    }
    if (hr >= 17 && hr < 20) {
      return {
        label: 'Dusk Sunset',
        icon: (
          <svg className="w-5 h-5 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 10v6M4.93 10.93l4.24-4.24M2 18h20M20 18a8 8 0 0 0-16 0" />
          </svg>
        ),
      };
    }
    return {
      label: 'Cosmic Night',
      icon: (
        <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ),
    };
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
    <div className="w-full glass-card rounded-[2rem] p-5 sm:p-6 border border-white/[0.10] relative overflow-hidden backdrop-blur-3xl bg-[#080c14]/85">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/15 flex items-center justify-center text-white text-xs shadow-inner">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-extrabold text-white tracking-tight">
                24-Hour Atmospheric Timeline
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.08] text-slate-300 font-mono font-bold border border-white/15">
                SCRUBBER
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Preview hourly solar trajectory &amp; thermal transitions
            </p>
          </div>
        </div>

        {/* Live Snap Button */}
        <button
          onClick={handleResetLive}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-md ${
            isLive
              ? 'bg-white text-black font-extrabold shadow-white/10'
              : 'bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 border border-white/15 hover:text-white'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-black animate-pulse' : 'bg-slate-500'}`} />
          <span>{isLive ? 'Live Observation' : 'Reset to Live'}</span>
        </button>
      </div>

      {/* Active Scrubbed Hour Telemetry Pill */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/50 border border-white/[0.08] mb-5">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center">
            {period.icon}
          </div>
          <div>
            <div className="text-xs font-extrabold text-white flex items-center space-x-2">
              <span className="font-mono">{formatHourLabel(activeItem.time)}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300">{period.label}</span>
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
            <div className="text-xs font-bold text-slate-300">{activeItem.precipitationProbability}% Rain</div>
            <div className="text-[10px] text-slate-400 font-mono">{activeItem.windSpeed} km/h</div>
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
          className="w-full h-2 bg-white/[0.08] rounded-lg appearance-none cursor-pointer accent-white focus:outline-none shadow-inner"
        />

        {/* Micro Hour Labels */}
        <div className="flex justify-between text-[10px] font-mono text-slate-400 px-1 select-none">
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
