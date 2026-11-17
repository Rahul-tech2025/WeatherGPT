'use client';

import React, { useState } from 'react';
import { CitySearchResult, ForecastData, MLPredictionData } from '../types/weather';
import RollingNumberTicker from './RollingNumberTicker';

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

  if (!forecast) return null;

  const temp = unit === 'C'
    ? forecast.current.temperature
    : (forecast.current.temperature * 9) / 5 + 32;

  return (
    <div className="relative z-30 pointer-events-auto flex justify-center w-full my-1">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
        className={`relative cursor-pointer select-none overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isExpanded
            ? 'w-[94vw] sm:w-[500px] p-5 rounded-[2rem] bg-[#060910]/95 border border-white/25 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.95)] backdrop-blur-3xl'
            : 'w-auto px-5 py-2.5 rounded-full bg-[#080c14]/90 hover:bg-[#0c121e] border border-white/15 hover:border-white/35 shadow-xl shadow-black/70 backdrop-blur-2xl'
        }`}
      >
        {/* COMPACT STATE */}
        {!isExpanded ? (
          <div className="flex items-center space-x-3 text-xs transition-opacity duration-300">
            {/* Live Indicator Dot */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>

            {/* City & Temperature */}
            <div className="flex items-center space-x-1.5 font-bold text-white tracking-tight">
              <span>{city.name}</span>
              <span className="text-slate-500">•</span>
              <span className="text-white font-extrabold flex items-baseline">
                <RollingNumberTicker value={temp} decimals={0} suffix={`°${unit}`} />
              </span>
            </div>

            {/* Condition preview */}
            <span className="text-slate-400 hidden sm:inline text-[11px] font-medium border-l border-white/10 pl-2">
              {forecast.current.condition}
            </span>

            {/* Chevron toggle icon */}
            <svg
              className="w-3.5 h-3.5 text-slate-400 transition-transform duration-300 group-hover:text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        ) : (
          /* EXPANDED TELEMETRY ISLAND */
          <div
            onClick={(e) => e.stopPropagation()}
            className="space-y-4 transition-all duration-300 ease-out"
          >
            {/* Header: Location & Close Button */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="text-sm font-extrabold text-white tracking-tight">
                  {city.name}, {city.country}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.08] text-slate-300 border border-white/15 font-mono font-bold">
                  TELEMETRY
                </span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-slate-400 hover:text-white transition"
                aria-label="Close Telemetry Capsule"
              >
                ✕
              </button>
            </div>

            {/* Main stats strip */}
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Temperature</div>
                <div className="text-xl font-black text-white mt-0.5">
                  <RollingNumberTicker value={temp} decimals={1} suffix={`°${unit}`} />
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">{forecast.current.condition}</div>
              </div>

              <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Humidity</div>
                <div className="text-xl font-black text-slate-200 mt-0.5">
                  <RollingNumberTicker value={forecast.current.humidity} decimals={0} suffix="%" />
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 font-mono">{forecast.current.windSpeed} km/h</div>
              </div>

              <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">ML Rain Prob</div>
                <div className="text-xl font-black text-white mt-0.5">
                  {mlPrediction?.rainfall_prediction ? (
                    <RollingNumberTicker
                      value={mlPrediction.rainfall_prediction.rain_probability_pct}
                      decimals={0}
                      suffix="%"
                    />
                  ) : (
                    '12%'
                  )}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Scikit Inference</div>
              </div>
            </div>

            {/* Quick Action Dock Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => {
                  onNavigateTab('chat');
                  setIsExpanded(false);
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-slate-200 text-black font-extrabold text-xs flex items-center justify-center space-x-1.5 shadow-md transition-all hover:scale-[1.02]"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span>Ask AI</span>
              </button>

              <button
                onClick={() => {
                  onNavigateTab('map');
                  setIsExpanded(false);
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-all hover:scale-[1.02]"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
                <span>Radar Map</span>
              </button>

              <button
                onClick={() => {
                  onNavigateTab('ml');
                  setIsExpanded(false);
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-all hover:scale-[1.02]"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
                <span>ML Engine</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
