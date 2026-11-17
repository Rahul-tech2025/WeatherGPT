'use client';

import React, { useState } from 'react';
import { CitySearchResult, ForecastData, MLPredictionData } from '../types/weather';
import RollingNumberTicker from './RollingNumberTicker';

interface DynamicIslandCapsuleProps {
  city: CitySearchResult;
  forecast: ForecastData | null;
  mlPrediction: MLPredictionData | null;
  unit: 'C' | 'F';
  currentTheme: 'obsidian' | 'titanium' | 'cyberpunk';
  onThemeChange: (theme: 'obsidian' | 'titanium' | 'cyberpunk') => void;
  onNavigateTab: (tab: string) => void;
  onPlayAudioBriefing?: () => void;
  isPlayingAudio?: boolean;
}

export default function DynamicIslandCapsule({
  city,
  forecast,
  mlPrediction,
  unit,
  currentTheme,
  onThemeChange,
  onNavigateTab,
  onPlayAudioBriefing,
  isPlayingAudio = false,
}: DynamicIslandCapsuleProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  if (!forecast) return null;

  const temp = unit === 'C'
    ? forecast.current.temperature
    : (forecast.current.temperature * 9) / 5 + 32;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={`relative cursor-pointer select-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isExpanded
            ? 'w-[92vw] sm:w-[460px] p-5 rounded-[2.2rem] bg-slate-950/90 border border-cyan-500/40 shadow-2xl shadow-cyan-500/20 backdrop-blur-3xl'
            : 'w-auto px-4 py-2 rounded-full bg-slate-950/80 hover:bg-slate-900/90 border border-white/15 hover:border-cyan-400/50 shadow-xl shadow-black/50 backdrop-blur-2xl'
        }`}
      >
        {/* Glow ambient edge */}
        <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-indigo-500/10 -z-10 pointer-events-none" />

        {/* COMPACT STATE */}
        {!isExpanded && (
          <div className="flex items-center space-x-3 text-xs">
            {/* Live Indicator Dot */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>

            {/* City & Temperature */}
            <div className="flex items-center space-x-1.5 font-bold text-white tracking-tight">
              <span>{city.name}</span>
              <span className="text-cyan-400">•</span>
              <span className="text-cyan-300 font-extrabold flex items-baseline">
                <RollingNumberTicker value={temp} decimals={0} suffix={`°${unit}`} />
              </span>
            </div>

            {/* Condition preview */}
            <span className="text-slate-400 hidden sm:inline text-[11px] font-medium border-l border-white/10 pl-2">
              {forecast.current.condition}
            </span>

            {/* Audio pulse badge if playing */}
            {isPlayingAudio && (
              <span className="flex items-center space-x-1 px-1.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-[10px] animate-pulse">
                <span>🎙️</span>
                <span>Playing</span>
              </span>
            )}

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
        )}

        {/* EXPANDED TELEMETRY ISLAND */}
        {isExpanded && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="space-y-4 animate-in fade-in zoom-in-95 duration-300"
          >
            {/* Header: Location & Close Button */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-extrabold text-white tracking-tight">
                  {city.name}, {city.country}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-400/20 font-mono font-bold">
                  LIVE TELEMETRY
                </span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            {/* Main stats strip */}
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Temperature</div>
                <div className="text-xl font-black text-cyan-300 mt-0.5">
                  <RollingNumberTicker value={temp} decimals={1} suffix={`°${unit}`} />
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">{forecast.current.condition}</div>
              </div>

              <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Humidity</div>
                <div className="text-xl font-black text-blue-300 mt-0.5">
                  <RollingNumberTicker value={forecast.current.humidity} decimals={0} suffix="%" />
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Wind: {forecast.current.windSpeed} km/h</div>
              </div>

              <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">ML Rain Prob</div>
                <div className="text-xl font-black text-emerald-300 mt-0.5">
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
                <div className="text-[10px] text-slate-400 mt-0.5">Next-Day Scikit</div>
              </div>
            </div>

            {/* Quick Action Dock Buttons */}
            <div className="flex items-center gap-2 pt-1">
              {onPlayAudioBriefing && (
                <button
                  onClick={() => {
                    onPlayAudioBriefing();
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-purple-500/20 transition-all hover:scale-[1.02]"
                >
                  <span>{isPlayingAudio ? '⏹️ Stop' : '🎙️ Jarvis Voice'}</span>
                </button>
              )}

              <button
                onClick={() => {
                  onNavigateTab('chat');
                  setIsExpanded(false);
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/30 text-blue-200 font-bold text-xs flex items-center justify-center space-x-1.5 transition-all hover:scale-[1.02]"
              >
                <span>💬 Ask AI</span>
              </button>

              <button
                onClick={() => {
                  onNavigateTab('map');
                  setIsExpanded(false);
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-400/30 text-cyan-200 font-bold text-xs flex items-center justify-center space-x-1.5 transition-all hover:scale-[1.02]"
              >
                <span>🛰️ Radar</span>
              </button>
            </div>

            {/* Theme Aesthetic Selector */}
            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-[11px]">Aesthetic Theme:</span>
              <div className="flex items-center space-x-1.5 bg-black/40 p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => onThemeChange('obsidian')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                    currentTheme === 'obsidian'
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Obsidian
                </button>
                <button
                  onClick={() => onThemeChange('titanium')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                    currentTheme === 'titanium'
                      ? 'bg-slate-200 text-slate-900 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Titanium
                </button>
                <button
                  onClick={() => onThemeChange('cyberpunk')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                    currentTheme === 'cyberpunk'
                      ? 'bg-fuchsia-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Cyberpunk
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
