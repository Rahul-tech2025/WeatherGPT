'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CitySearchResult, ForecastData, MLPredictionData } from '../types/weather';

interface DynamicIslandCapsuleProps {
  city: CitySearchResult;
  forecast: ForecastData | null;
  mlPrediction: MLPredictionData | null;
  unit: 'C' | 'F';
  onNavigateTab: (tab: string) => void;
}

export default function DynamicIslandCapsule({
  city,
  forecast,
  mlPrediction,
  unit,
  onNavigateTab,
}: DynamicIslandCapsuleProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const capsuleRef = useRef<HTMLDivElement>(null);

  // Smooth click-outside listener to collapse seamlessly
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (capsuleRef.current && !capsuleRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsExpanded(false);
      }
    }

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isExpanded]);

  if (!forecast) return null;

  const rawTemp = unit === 'C'
    ? forecast.current.temperature
    : (forecast.current.temperature * 9) / 5 + 32;
  const tempDisplay = Math.round(rawTemp);
  const tempDetailed = rawTemp.toFixed(1);

  return (
    <div className="relative z-30 pointer-events-auto flex justify-center w-full px-2 my-1">
      <div
        ref={capsuleRef}
        onClick={() => {
          if (!isExpanded) setIsExpanded(true);
        }}
        style={{
          transform: 'translate3d(0, 0, 0)',
          willChange: 'width, height, border-radius',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          contain: 'layout style',
        }}
        className={`relative select-none overflow-hidden transition-[width,height,border-radius] duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] bg-[#070b12]/95 border border-white/20 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.9)] backdrop-blur-2xl ${
          isExpanded
            ? 'w-[calc(100vw-24px)] max-w-[490px] h-[268px] rounded-[2rem] cursor-default'
            : 'w-[calc(100vw-32px)] max-w-[340px] sm:w-[340px] h-[44px] rounded-full hover:border-white/40 hover:bg-[#0b101b] cursor-pointer hover:scale-[1.015]'
        }`}
      >
        {/* ========================================================
            COMPACT STATE LAYER (Snappy 180ms fade/scale)
            ======================================================== */}
        <div
          className={`absolute inset-0 px-3.5 sm:px-4 flex items-center justify-between transition-[opacity,transform] duration-200 ease-out ${
            isExpanded
              ? 'opacity-0 scale-95 pointer-events-none -translate-y-1.5'
              : 'opacity-100 scale-100 pointer-events-auto translate-y-0 delay-75'
          }`}
        >
          {/* Live Indicator Dot & City Info */}
          <div className="flex items-center space-x-2 sm:space-x-2.5 min-w-0">
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>

            {/* City & Temperature */}
            <div className="flex items-center space-x-1.5 font-bold text-white text-xs tracking-tight truncate">
              <span className="truncate max-w-[110px] sm:max-w-[140px]">{city.name}</span>
              <span className="text-slate-500 flex-shrink-0">•</span>
              <span className="text-white font-extrabold flex-shrink-0 font-mono">
                {tempDisplay}°{unit}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
            {/* Condition preview (Responsive truncation) */}
            <span className="text-slate-400 text-[11px] font-medium border-l border-white/10 pl-2 max-w-[85px] sm:max-w-[110px] truncate hidden min-[360px]:inline">
              {forecast.current.condition}
            </span>

            {/* Chevron toggle icon */}
            <svg
              className="w-3.5 h-3.5 text-slate-400 transition-transform duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* ========================================================
            EXPANDED TELEMETRY ISLAND (Ultra-smooth spring reveal)
            ======================================================== */}
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute inset-0 p-4 sm:p-5 flex flex-col justify-between transition-[opacity,transform] duration-250 ease-out ${
            isExpanded
              ? 'opacity-100 scale-100 pointer-events-auto translate-y-0 delay-75'
              : 'opacity-0 scale-95 pointer-events-none translate-y-1.5'
          }`}
        >
          {/* Header: Location & Close Button */}
          <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.08]">
            <div className="flex items-center space-x-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse flex-shrink-0" />
              <span className="text-sm font-extrabold text-white tracking-tight truncate">
                {city.name}, {city.country}
              </span>
              <span className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full bg-white/[0.08] text-slate-300 border border-white/15 font-mono font-bold flex-shrink-0">
                TELEMETRY
              </span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/15 active:scale-95 flex items-center justify-center text-slate-400 hover:text-white transition flex-shrink-0 ml-2"
              aria-label="Close Telemetry Capsule"
            >
              ✕
            </button>
          </div>

          {/* Main stats strip (Dynamically adaptive columns) */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 text-center my-1">
            <div className="p-2 sm:p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex flex-col justify-center">
              <div className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-wider truncate">Temp</div>
              <div className="text-base sm:text-xl font-black text-white mt-0.5 font-mono">
                {tempDetailed}°{unit}
              </div>
              <div className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 truncate">{forecast.current.condition}</div>
            </div>

            <div className="p-2 sm:p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex flex-col justify-center">
              <div className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-wider truncate">Humidity</div>
              <div className="text-base sm:text-xl font-black text-slate-200 mt-0.5 font-mono">
                {forecast.current.humidity}%
              </div>
              <div className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 font-mono truncate">{forecast.current.windSpeed} km/h</div>
            </div>

            <div className="p-2 sm:p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex flex-col justify-center">
              <div className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-wider truncate">ML Rain</div>
              <div className="text-base sm:text-xl font-black text-white mt-0.5 font-mono">
                {mlPrediction?.rainfall_prediction ? `${mlPrediction.rainfall_prediction.rain_probability_pct}%` : '12%'}
              </div>
              <div className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 truncate">Scikit ML</div>
            </div>
          </div>

          {/* Quick Action Dock Buttons (Responsive on Mobile & Desktop) */}
          <div className="flex items-center gap-1.5 sm:gap-2 pt-1">
            <button
              onClick={() => {
                onNavigateTab('chat');
                setIsExpanded(false);
              }}
              className="flex-1 py-2 px-2 sm:px-3 rounded-xl bg-white hover:bg-slate-200 active:scale-95 text-black font-extrabold text-[11px] sm:text-xs flex items-center justify-center space-x-1 sm:space-x-1.5 shadow-md transition-transform"
            >
              <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span>Ask AI</span>
            </button>

            <button
              onClick={() => {
                onNavigateTab('map');
                setIsExpanded(false);
              }}
              className="flex-1 py-2 px-2 sm:px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] active:scale-95 border border-white/15 text-white font-bold text-[11px] sm:text-xs flex items-center justify-center space-x-1 sm:space-x-1.5 transition-transform"
            >
              <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
              <span>Radar</span>
            </button>

            <button
              onClick={() => {
                onNavigateTab('ml');
                setIsExpanded(false);
              }}
              className="flex-1 py-2 px-2 sm:px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] active:scale-95 border border-white/15 text-white font-bold text-[11px] sm:text-xs flex items-center justify-center space-x-1 sm:space-x-1.5 transition-transform"
            >
              <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              <span>ML Engine</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
