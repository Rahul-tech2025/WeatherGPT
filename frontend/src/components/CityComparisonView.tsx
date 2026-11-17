'use client';

import React, { useState, useEffect } from 'react';
import { searchCities, getForecast, getMLPrediction } from '../services/api';
import { CitySearchResult, ForecastData, MLPredictionData } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';

interface CityComparisonViewProps {
  unit: 'C' | 'F';
  initialCity: CitySearchResult;
}

interface ComparedCityData {
  city: CitySearchResult;
  forecast: ForecastData | null;
  mlPrediction: MLPredictionData | null;
  isLoading: boolean;
  error?: string;
}

export default function CityComparisonView({ unit, initialCity }: CityComparisonViewProps) {
  const [citiesData, setCitiesData] = useState<ComparedCityData[]>([
    { city: initialCity, forecast: null, mlPrediction: null, isLoading: true }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CitySearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Load weather & ML for a city index
  const loadCityData = async (city: CitySearchResult, index: number) => {
    setCitiesData((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], isLoading: true, error: undefined };
      return next;
    });

    try {
      const [forecast, mlPred] = await Promise.all([
        getForecast(city.latitude, city.longitude),
        getMLPrediction(city.latitude, city.longitude, city.name)
      ]);

      setCitiesData((prev) => {
        const next = [...prev];
        next[index] = { city, forecast, mlPrediction: mlPred, isLoading: false };
        return next;
      });
    } catch {
      setCitiesData((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], isLoading: false, error: 'Failed to load weather' };
        return next;
      });
    }
  };

  useEffect(() => {
    // Load initial city
    loadCityData(initialCity, 0);

    // Add a default second city (e.g. New Delhi) for instant comparison
    const delhi: CitySearchResult = {
      id: 1273294,
      name: 'Delhi',
      latitude: 28.6519,
      longitude: 77.2315,
      country: 'India',
      countryCode: 'IN',
      admin1: 'Delhi',
      timezone: 'Asia/Kolkata',
      elevation: 216,
      population: 10927986
    };

    setCitiesData((prev) => [
      prev[0],
      { city: delhi, forecast: null, mlPrediction: null, isLoading: true }
    ]);

    loadCityData(delhi, 1);
  }, [initialCity]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await searchCities(searchQuery.trim());
      setSearchResults(results);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const addCityToCompare = (city: CitySearchResult) => {
    if (citiesData.length >= 3) {
      alert('You can compare up to 3 cities simultaneously.');
      return;
    }

    if (citiesData.some((c) => c.city.id === city.id || c.city.name.toLowerCase() === city.name.toLowerCase())) {
      alert('City is already in the comparison list.');
      return;
    }

    const newIndex = citiesData.length;
    setCitiesData((prev) => [...prev, { city, forecast: null, mlPrediction: null, isLoading: true }]);
    setSearchQuery('');
    setSearchResults([]);
    loadCityData(city, newIndex);
  };

  const removeCity = (index: number) => {
    if (citiesData.length <= 1) {
      alert('At least one city is required.');
      return;
    }
    setCitiesData((prev) => prev.filter((_, i) => i !== index));
  };

  const formatTemp = (tempC?: number) => {
    if (tempC === undefined || tempC === null) return '--';
    if (unit === 'F') {
      return `${Math.round((tempC * 9) / 5 + 32)}°F`;
    }
    return `${Math.round(tempC * 10) / 10}°C`;
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Controls Header */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">⚖️</span>
            <h2 className="text-xl md:text-2xl font-bold text-white">Multi-City Weather Comparison</h2>
          </div>
          <p className="text-xs text-slate-400">
            Compare live atmospheric conditions and Scikit-learn ML predictions side-by-side ({citiesData.length}/3 cities)
          </p>
        </div>

        {/* Add City Search */}
        <div className="relative w-full md:w-80">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search city to add..."
              className="flex-1 bg-slate-800/80 border border-slate-700 rounded-2xl px-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold disabled:opacity-50 transition"
            >
              {isSearching ? '...' : 'Add'}
            </button>
          </form>

          {/* Search Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-30 overflow-hidden divide-y divide-slate-800">
              {searchResults.map((c) => (
                <button
                  key={c.id}
                  onClick={() => addCityToCompare(c)}
                  className="w-full text-left p-3 text-xs hover:bg-slate-800 transition flex items-center justify-between"
                >
                  <span className="text-white font-medium">
                    {c.name} <span className="text-slate-400">({c.admin1 ? `${c.admin1}, ` : ''}{c.countryCode})</span>
                  </span>
                  <span className="text-indigo-400 text-[10px] font-semibold">+ Compare</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Comparison Grid */}
      <div className={`grid grid-cols-1 ${citiesData.length === 2 ? 'md:grid-cols-2' : citiesData.length === 3 ? 'md:grid-cols-3' : 'grid-cols-1'} gap-6`}>
        {citiesData.map((item, idx) => {
          const curr = item.forecast?.current;
          const today = item.forecast?.daily?.[0];
          const ml = item.mlPrediction;

          return (
            <div
              key={idx}
              className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between relative overflow-hidden transition-all"
            >
              {/* Top Row: City Name & Remove Button */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">{item.city.name}</h3>
                    <p className="text-xs text-slate-400">
                      {item.city.admin1 ? `${item.city.admin1}, ` : ''}{item.city.country}
                    </p>
                  </div>
                  {citiesData.length > 1 && (
                    <button
                      onClick={() => removeCity(idx)}
                      className="w-7 h-7 rounded-full bg-slate-800/80 hover:bg-rose-900/50 hover:text-rose-300 text-slate-400 flex items-center justify-center text-xs transition"
                      title="Remove city"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Loading / Error State */}
                {item.isLoading && (
                  <div className="py-12 text-center text-xs text-slate-400 animate-pulse">
                    <span className="inline-block w-3 h-3 rounded-full bg-blue-500 animate-ping mr-2"></span>
                    Fetching telemetry...
                  </div>
                )}

                {item.error && (
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs mb-4">
                    ⚠️ {item.error}
                  </div>
                )}

                {/* Weather Highlights */}
                {curr && (
                  <div>
                    <div className="flex items-center justify-between my-4">
                      <div>
                        <div className="text-4xl font-extrabold text-white tracking-tight">
                          {formatTemp(curr.temperature)}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Feels like {formatTemp(curr.feelsLike)}
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <WeatherIcon icon={curr.icon} isDay={curr.isDay} className="w-12 h-12" />
                        <span className="text-xs text-slate-300 font-medium mt-1">{curr.condition}</span>
                      </div>
                    </div>

                    {/* Metrics List */}
                    <div className="space-y-2.5 py-4 border-t border-b border-slate-800 text-xs">
                      <div className="flex justify-between text-slate-300">
                        <span className="text-slate-400">High / Low Today:</span>
                        <span className="font-medium text-white">{formatTemp(today?.tempMax)} / {formatTemp(today?.tempMin)}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span className="text-slate-400">Precipitation:</span>
                        <span className="font-medium text-blue-400">{curr.precipitation} mm ({today?.precipitationProbabilityMax ?? 0}%)</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span className="text-slate-400">Relative Humidity:</span>
                        <span className="font-medium text-white">{curr.humidity}%</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span className="text-slate-400">Wind Velocity:</span>
                        <span className="font-medium text-white">{curr.windSpeed} km/h</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span className="text-slate-400">Surface Pressure:</span>
                        <span className="font-medium text-white">{curr.pressure} hPa</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Machine Learning Insights Section */}
              <div className="mt-4 pt-3">
                <div className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span>🧠</span> Custom ML Predictions
                </div>
                {ml ? (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                      <div className="text-[10px] text-slate-400">Predicted Temp</div>
                      <div className="font-bold text-white text-sm mt-0.5">
                        {formatTemp(ml.temperature_prediction.predicted_temp_celsius)}
                      </div>
                      <div className="text-[9px] text-amber-400/90 font-mono mt-0.5">
                        R² = {ml.temperature_prediction.metrics.r2}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                      <div className="text-[10px] text-slate-400">Rain Probability</div>
                      <div className="font-bold text-blue-400 text-sm mt-0.5">
                        {ml.rainfall_prediction.rain_probability_pct}%
                      </div>
                      <div className="text-[9px] text-emerald-400/90 font-mono mt-0.5">
                        Acc = {Math.round(ml.rainfall_prediction.metrics.accuracy * 100)}%
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-800/30 text-[11px] text-slate-400 text-center font-mono">
                    ML prediction in progress...
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
