'use client';

import React, { useState, useEffect } from 'react';
import { getHistoricalWeather, HistoricalWeatherRecord } from '../services/api';
import { CitySearchResult } from '../types/weather';

interface HistoricalAnalyticsViewProps {
  city: CitySearchResult;
  unit: 'C' | 'F';
}

export default function HistoricalAnalyticsView({ city, unit }: HistoricalAnalyticsViewProps) {
  const [days, setDays] = useState<number>(14);
  const [records, setRecords] = useState<HistoricalWeatherRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getHistoricalWeather(city.latitude, city.longitude, days);
        if (data && data.records.length > 0) {
          setRecords(data.records);
        } else {
          setError('No historical weather observations found for this time period.');
        }
      } catch {
        setError('Failed to fetch historical weather data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [city, days]);

  const formatTemp = (tempC?: number) => {
    if (tempC === undefined || tempC === null) return '--';
    if (unit === 'F') {
      return `${Math.round((tempC * 9) / 5 + 32)}°F`;
    }
    return `${Math.round(tempC * 10) / 10}°C`;
  };

  // Statistical calculations
  const avgTemp = records.length > 0
    ? records.reduce((acc, r) => acc + (r.tempMean ?? (r.tempMax + r.tempMin) / 2), 0) / records.length
    : 0;

  const maxTemp = records.length > 0 ? Math.max(...records.map((r) => r.tempMax)) : 0;
  const minTemp = records.length > 0 ? Math.min(...records.map((r) => r.tempMin)) : 0;
  const totalRain = records.length > 0 ? records.reduce((acc, r) => acc + (r.precipitation || 0), 0) : 0;
  const rainyDays = records.filter((r) => (r.precipitation || 0) > 0.1).length;

  return (
    <div className="w-full space-y-6">
      {/* Header & Controls */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">📈</span>
            <h2 className="text-xl md:text-2xl font-bold text-white">Historical Weather Trends & Analytics</h2>
          </div>
          <p className="text-xs text-slate-400">
            Observed climatic telemetry for <strong className="text-slate-200">{city.name}, {city.country}</strong>
          </p>
        </div>

        {/* Days Selector Tabs */}
        <div className="flex items-center bg-slate-800/80 p-1 rounded-2xl border border-slate-700/60 self-start sm:self-auto">
          {[7, 14, 30].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                days === d
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              Past {d} Days
            </button>
          ))}
        </div>
      </div>

      {/* Summary Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 backdrop-blur-xl">
          <div className="text-xs text-slate-400">Average Temp</div>
          <div className="text-2xl font-bold text-white mt-1">{formatTemp(avgTemp)}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Mean daily temperature</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 backdrop-blur-xl">
          <div className="text-xs text-slate-400">Peak High / Low</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">
            {formatTemp(maxTemp)} <span className="text-slate-400 text-base font-normal">/ {formatTemp(minTemp)}</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Over past {days} days</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 backdrop-blur-xl">
          <div className="text-xs text-slate-400">Total Precipitation</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">{Math.round(totalRain * 10) / 10} mm</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Cumulative rainfall</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 backdrop-blur-xl">
          <div className="text-xs text-slate-400">Rainy Days</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{rainyDays} / {records.length}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">&gt; 0.1 mm precipitation</div>
        </div>
      </div>

      {/* Loading & Error Banners */}
      {isLoading && (
        <div className="p-12 text-center text-xs text-slate-400 bg-slate-900/40 rounded-3xl border border-slate-800 animate-pulse">
          <span className="inline-block w-3 h-3 rounded-full bg-blue-500 animate-ping mr-2"></span>
          Querying historical weather records...
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
          ⚠️ {error}
        </div>
      )}

      {/* Custom High/Low Bar Analytics Chart */}
      {!isLoading && records.length > 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-white text-base">Temperature Variance & Trends</h3>
              <p className="text-xs text-slate-400">Daily high and low temperatures recorded by meteorological stations</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 rounded bg-amber-400"></span> Max Temp
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 rounded bg-blue-400"></span> Min Temp
              </span>
            </div>
          </div>

          {/* Visual Vertical Bars Container */}
          <div className="h-64 flex items-end gap-2 sm:gap-3 overflow-x-auto pb-4 pt-6 no-scrollbar">
            {records.map((r, i) => {
              // Normalize height against max range (e.g. 0 to 45 deg)
              const range = Math.max(maxTemp, 35);
              const maxPct = Math.max((r.tempMax / range) * 100, 15);
              const minPct = Math.max((r.tempMin / range) * 100, 10);
              const dayStr = r.date.slice(5); // MM-DD

              return (
                <div key={i} className="flex-1 min-w-[32px] flex flex-col items-center justify-end h-full group relative">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-12 bg-slate-950 border border-slate-700 text-white text-[10px] rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-20 shadow-lg">
                    {r.date}: High {formatTemp(r.tempMax)} | Low {formatTemp(r.tempMin)} | Rain: {r.precipitation}mm
                  </div>

                  {/* Dual Bar Cluster */}
                  <div className="w-full flex items-end justify-center gap-1 h-full">
                    {/* Max Temp Bar */}
                    <div
                      className="w-1/2 rounded-t-md bg-gradient-to-t from-amber-600 to-amber-400 group-hover:from-amber-500 group-hover:to-amber-300 transition-all"
                      style={{ height: `${maxPct}%` }}
                    ></div>
                    {/* Min Temp Bar */}
                    <div
                      className="w-1/2 rounded-t-md bg-gradient-to-t from-blue-700 to-blue-500 group-hover:from-blue-600 group-hover:to-blue-400 transition-all"
                      style={{ height: `${minPct}%` }}
                    ></div>
                  </div>

                  {/* Date Label */}
                  <span className="text-[10px] text-slate-400 font-mono mt-2 truncate w-full text-center">
                    {dayStr}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Precipitation Volume Timeline */}
      {!isLoading && records.length > 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">
          <div className="mb-4">
            <h3 className="font-bold text-white text-base">Precipitation Accumulation</h3>
            <p className="text-xs text-slate-400">Daily rainfall measured in millimeters (mm)</p>
          </div>

          <div className="h-44 flex items-end gap-2 sm:gap-3 overflow-x-auto pb-4 pt-4 no-scrollbar">
            {records.map((r, i) => {
              const maxRain = Math.max(...records.map((x) => x.precipitation || 0), 10);
              const rainPct = r.precipitation > 0 ? Math.max((r.precipitation / maxRain) * 100, 8) : 2;
              const dayStr = r.date.slice(5);

              return (
                <div key={i} className="flex-1 min-w-[32px] flex flex-col items-center justify-end h-full group relative">
                  {/* Tooltip */}
                  <div className="absolute -top-10 bg-slate-950 border border-slate-700 text-white text-[10px] rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-20 shadow-lg">
                    {r.date}: {r.precipitation} mm
                  </div>

                  {/* Rain Bar */}
                  <div
                    className={`w-full rounded-t-md transition-all ${
                      r.precipitation > 0
                        ? 'bg-gradient-to-t from-cyan-600 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-400'
                        : 'bg-slate-800'
                    }`}
                    style={{ height: `${rainPct}%` }}
                  ></div>

                  <span className="text-[10px] text-slate-400 font-mono mt-2 truncate w-full text-center">
                    {dayStr}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
