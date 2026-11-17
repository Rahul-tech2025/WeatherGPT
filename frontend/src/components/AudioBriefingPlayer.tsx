'use client';

import React from 'react';
import { CitySearchResult, ForecastData, MLPredictionData } from '../types/weather';
import FluidAIWaveform from './FluidAIWaveform';

interface AudioBriefingPlayerProps {
  city: CitySearchResult;
  forecast: ForecastData | null;
  mlPrediction: MLPredictionData | null;
  unit: 'C' | 'F';
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export default function AudioBriefingPlayer({
  city,
  forecast,
  mlPrediction,
  unit,
  isPlaying,
  onTogglePlay,
}: AudioBriefingPlayerProps) {
  if (!isPlaying) return null;

  const currentTemp = forecast
    ? unit === 'C'
      ? Math.round(forecast.current.temperature)
      : Math.round((forecast.current.temperature * 9) / 5 + 32)
    : '--';

  const rainProb = mlPrediction?.rainfall_prediction?.rain_probability_pct ?? 12;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90vw] sm:w-[440px] p-4 rounded-3xl bg-slate-950/90 border border-purple-500/40 shadow-2xl shadow-purple-500/20 backdrop-blur-2xl animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
          <span className="text-xs font-black text-white tracking-wide">
            JARVIS METEOROLOGICAL AUDIO BRIEFING
          </span>
        </div>
        <button
          onClick={onTogglePlay}
          className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center text-xs transition"
          aria-label="Close Audio Player"
        >
          ✕
        </button>
      </div>

      {/* Fluid Siri Waveform */}
      <FluidAIWaveform isActive={isPlaying} className="h-12 -my-1" />

      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/[0.08]">
        <span className="truncate pr-2">
          {city.name} • {currentTemp}°{unit} • ML Rain: {rainProb}%
        </span>
        <button
          onClick={onTogglePlay}
          className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-400/30 text-[10px] font-bold transition shrink-0"
        >
          Stop Audio
        </button>
      </div>
    </div>
  );
}
