'use strict';
'use client';

import React from 'react';
import { CurrentWeather, DailyForecastItem } from '../types/weather';

interface WeatherMetricsGridProps {
  current: CurrentWeather;
  todayDaily?: DailyForecastItem;
}

export const WeatherMetricsGrid: React.FC<WeatherMetricsGridProps> = ({ current, todayDaily }) => {
  // Calculate compass direction from degrees
  const getWindDirectionCompass = (deg: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(deg / 22.5) % 16;
    return directions[index];
  };

  // UV interpretation
  const getUvLevel = (uv: number) => {
    if (uv <= 2) return { text: 'Low', color: 'text-emerald-400', tip: 'No protection needed' };
    if (uv <= 5) return { text: 'Moderate', color: 'text-amber-400', tip: 'Wear sunglasses & hat' };
    if (uv <= 7) return { text: 'High', color: 'text-orange-400', tip: 'Apply SPF 30+ sunscreen' };
    if (uv <= 10) return { text: 'Very High', color: 'text-rose-400', tip: 'Avoid midday sun' };
    return { text: 'Extreme', color: 'text-purple-400', tip: 'Stay indoors if possible' };
  };

  const uvInfo = getUvLevel(todayDaily?.uvIndexMax ?? 2);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      
      {/* 1. Wind & Gusts */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 shadow-xl">
        <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-3 uppercase tracking-wider">
          <span className="flex items-center space-x-1.5">
            <span>💨</span>
            <span>Wind & Gusts</span>
          </span>
          <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-300">
            {getWindDirectionCompass(current.windDirection)} ({current.windDirection}°)
          </span>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-white">{current.windSpeed}</span>
          <span className="text-slate-400 text-sm font-medium">km/h</span>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Max gust today: <strong className="text-slate-200">{todayDaily?.windSpeedMax ?? current.windSpeed} km/h</strong>
        </p>
      </div>

      {/* 2. Humidity & Air Quality Context */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 shadow-xl">
        <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-3 uppercase tracking-wider">
          <span className="flex items-center space-x-1.5">
            <span>💧</span>
            <span>Relative Humidity</span>
          </span>
          <span className="text-[10px] bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded-full border border-blue-800/40">
            {current.humidity > 70 ? 'High' : current.humidity < 30 ? 'Dry' : 'Normal'}
          </span>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-white">{current.humidity}%</span>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Apparent feels like: <strong className="text-slate-200">{Math.round(current.feelsLike)}°C</strong>
        </p>
      </div>

      {/* 3. UV Index */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 shadow-xl">
        <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-3 uppercase tracking-wider">
          <span className="flex items-center space-x-1.5">
            <span>☀️</span>
            <span>UV Index</span>
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 ${uvInfo.color}`}>
            {uvInfo.text}
          </span>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-white">{todayDaily?.uvIndexMax ?? '1.5'}</span>
          <span className="text-slate-400 text-sm">of 12</span>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          💡 {uvInfo.tip}
        </p>
      </div>

      {/* 4. Atmospheric Pressure */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 shadow-xl">
        <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-3 uppercase tracking-wider">
          <span className="flex items-center space-x-1.5">
            <span>🧭</span>
            <span>Barometric Pressure</span>
          </span>
          <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-300">
            {current.pressure > 1013 ? 'High' : 'Normal'}
          </span>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-white">{Math.round(current.pressure)}</span>
          <span className="text-slate-400 text-sm font-medium">hPa</span>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Standard sea-level: 1013.25 hPa
        </p>
      </div>

      {/* 5. Precipitation Sum */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 shadow-xl">
        <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-3 uppercase tracking-wider">
          <span className="flex items-center space-x-1.5">
            <span>🌧️</span>
            <span>Rainfall Activity</span>
          </span>
          <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-300">
            {current.precipitation > 0 ? 'Active' : 'No Rain'}
          </span>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-white">{current.precipitation}</span>
          <span className="text-slate-400 text-sm font-medium">mm/hr</span>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Expected today: <strong className="text-slate-200">{todayDaily?.precipitationSum ?? 0} mm</strong>
        </p>
      </div>

      {/* 6. AI & Machine Learning Status Indicator */}
      <div className="bg-gradient-to-br from-blue-950/40 via-indigo-950/30 to-purple-950/40 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-5 shadow-xl">
        <div className="flex items-center justify-between text-blue-300 text-xs font-semibold mb-3 uppercase tracking-wider">
          <span className="flex items-center space-x-1.5">
            <span>🧠</span>
            <span>AI & ML Engines</span>
          </span>
          <span className="text-[10px] bg-blue-500/20 border border-blue-400/30 text-blue-300 px-2 py-0.5 rounded-full font-bold">
            Dual AI Active
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          <strong>WeatherGPT</strong> features <strong>Gemini Generative AI</strong> for conversational synthesis &amp; <strong>Custom Scikit-learn Models</strong> for next-day temperature &amp; rainfall predictions.
        </p>
        <div className="mt-3 flex items-center space-x-2 text-[11px] text-blue-400 font-semibold">
          <span>Explore ML tab above ➔</span>
        </div>
      </div>

    </div>
  );
};
