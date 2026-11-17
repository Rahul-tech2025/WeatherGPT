'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { SearchBar } from '../components/SearchBar';
import { CurrentWeatherCard } from '../components/CurrentWeatherCard';
import { HourlyForecast } from '../components/HourlyForecast';
import { DailyForecast } from '../components/DailyForecast';
import { WeatherMetricsGrid } from '../components/WeatherMetricsGrid';
import MLInsightsCard from '../components/MLInsightsCard';
import AIChatView from '../components/AIChatView';
import CityComparisonView from '../components/CityComparisonView';
import HistoricalAnalyticsView from '../components/HistoricalAnalyticsView';
import WeatherMapView from '../components/WeatherMapView';
import { getForecast, getMLPrediction, getMLMetrics } from '../services/api';
import { CitySearchResult, ForecastData, MLPredictionData, MLMetricsSummary } from '../types/weather';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [city, setCity] = useState<CitySearchResult>({
    id: 1268782,
    name: 'Jalandhar',
    latitude: 31.3256,
    longitude: 75.5792,
    country: 'India',
    countryCode: 'IN',
    admin1: 'Punjab',
    timezone: 'Asia/Kolkata',
    elevation: 243,
    population: 868929
  });

  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [mlPrediction, setMlPrediction] = useState<MLPredictionData | null>(null);
  const [mlMetrics, setMlMetrics] = useState<MLMetricsSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMlLoading, setIsMlLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = async (lat: number, lon: number, cityName: string) => {
    setIsLoading(true);
    setError(null);
    setIsMlLoading(true);
    try {
      const data = await getForecast(lat, lon);
      setForecast(data);

      // Async fetch ML data
      getMLPrediction(lat, lon, cityName)
        .then(pred => setMlPrediction(pred))
        .catch(() => {})
        .finally(() => setIsMlLoading(false));

      getMLMetrics()
        .then(m => setMlMetrics(m))
        .catch(() => {});
    } catch (err: unknown) {
      console.error('Error fetching forecast:', err);
      const errMsg = err instanceof Error ? err.message : 'Failed to load weather data';
      setError(errMsg);
      setIsMlLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData(city.latitude, city.longitude, city.name);
  }, [city]);

  const handleSelectCity = (newCity: CitySearchResult) => {
    setCity(newCity);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      
      {/* 1. Header / Navbar */}
      <Navbar
        temperatureUnit={unit}
        onToggleUnit={() => setUnit(unit === 'C' ? 'F' : 'C')}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
      />

      {/* 2. Main Body Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        
        {/* TAB 1: WEATHER DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Search Bar */}
            <SearchBar onSelectCity={handleSelectCity} currentCityName={city.name} />

            {/* Error Banner */}
            {error && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center justify-between">
                <span>⚠️ {error}</span>
                <button
                  onClick={() => fetchWeatherData(city.latitude, city.longitude, city.name)}
                  className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-500 transition"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Loading Skeleton */}
            {isLoading && !forecast && (
              <div className="space-y-6 animate-pulse">
                <div className="h-64 bg-slate-900/60 rounded-3xl border border-slate-800" />
                <div className="h-36 bg-slate-900/60 rounded-3xl border border-slate-800" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="h-80 bg-slate-900/60 rounded-3xl border border-slate-800" />
                  <div className="h-80 bg-slate-900/60 rounded-3xl border border-slate-800" />
                </div>
              </div>
            )}

            {/* Weather Content */}
            {forecast && (
              <div className="space-y-6">
                
                {/* Hero Current Weather Card */}
                <CurrentWeatherCard
                  cityName={city.name}
                  admin1={city.admin1}
                  country={city.country}
                  current={forecast.current}
                  todayDaily={forecast.daily[0]}
                  unit={unit}
                />

                {/* 24-Hour Hourly Strip */}
                <HourlyForecast hourly={forecast.hourly} unit={unit} />

                {/* AI / Machine Learning Insights Card */}
                <MLInsightsCard
                  prediction={mlPrediction}
                  metrics={mlMetrics}
                  unit={unit === 'C' ? 'celsius' : 'fahrenheit'}
                  isLoading={isMlLoading}
                />

                {/* 7-Day Forecast & Detailed Weather Metrics Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                  <DailyForecast daily={forecast.daily} unit={unit} />
                  <WeatherMetricsGrid current={forecast.current} todayDaily={forecast.daily[0]} />
                </div>

              </div>
            )}

          </div>
        )}

        {/* TAB 2: MACHINE LEARNING PREDICTIONS */}
        {activeTab === 'ml' && (
          <div className="space-y-6">
            <MLInsightsCard
              prediction={mlPrediction}
              metrics={mlMetrics}
              unit={unit === 'C' ? 'celsius' : 'fahrenheit'}
              isLoading={isMlLoading}
            />

            <div className="w-full bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-3xl">🧠</span>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white">Custom Machine Learning Engine Architecture</h2>
                  <p className="text-xs text-slate-400">Scikit-learn Regressors & Classifiers trained on 2019-2024 Archive Data</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="p-6 rounded-2xl bg-slate-800/40 border border-blue-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-bold text-blue-400">Model A: Temperature Regressor</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">Regression</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">
                    Linear Regression outperformed Random Forest Regressor on chronological 2024 unseen test split with R² = 0.9750 and MAE = 1.048°C.
                  </p>
                  <div className="text-xs font-mono text-slate-300 bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
                    <div>Winning Model: LinearRegression</div>
                    <div>Validation MAE: 1.048 °C</div>
                    <div>Validation R²: 0.9750</div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-800/40 border border-emerald-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-bold text-emerald-400">Model B: Rainfall Classifier</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">Classification</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">
                    Logistic Regression with balanced class weights achieved 83.56% Accuracy and 0.7115 F1 Score on 2024 test observations.
                  </p>
                  <div className="text-xs font-mono text-slate-300 bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
                    <div>Winning Model: LogisticRegression</div>
                    <div>Validation Accuracy: 83.56%</div>
                    <div>ROC AUC Score: 0.8362</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/20 transition"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: GEMINI AI CONVERSATIONAL ASSISTANT */}
        {activeTab === 'chat' && (
          <AIChatView currentCity={city} />
        )}

        {/* TAB 4: CITY COMPARISON */}
        {activeTab === 'compare' && (
          <CityComparisonView unit={unit} initialCity={city} />
        )}

        {/* TAB 5: HISTORICAL ANALYTICS */}
        {activeTab === 'history' && (
          <HistoricalAnalyticsView city={city} unit={unit} />
        )}

        {/* TAB 6: INTERACTIVE WEATHER RADAR & MAP */}
        {activeTab === 'map' && (
          <WeatherMapView city={city} unit={unit} onSelectCity={setCity} />
        )}

      </main>

      {/* 3. Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 backdrop-blur-md py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-300">WeatherGPT</span>
            <span>•</span>
            <span>Lovely Professional University (LPU) Mini Project</span>
          </div>
          <div className="text-slate-400">
            Lead Developer: <strong className="text-slate-200">Rahul Choudhary</strong> | Team: Gurbani, Karamjit, Tisha
          </div>
        </div>
      </footer>

    </div>
  );
}
