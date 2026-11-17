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
import OrbActionsDock from '../components/OrbActionsDock';
import AtmosphericParticleCanvas from '../components/AtmosphericParticleCanvas';
import DynamicIslandCapsule from '../components/DynamicIslandCapsule';
import AudioBriefingPlayer from '../components/AudioBriefingPlayer';
import TimeMachineScrubber from '../components/TimeMachineScrubber';
import { getForecast, getMLPrediction, getMLMetrics } from '../services/api';
import { CitySearchResult, ForecastData, MLPredictionData, MLMetricsSummary, HourlyForecastItem } from '../types/weather';

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

  // Elite Design Engine States
  const [currentTheme, setCurrentTheme] = useState<'obsidian' | 'titanium' | 'cyberpunk'>('obsidian');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [scrubbedHour, setScrubbedHour] = useState<HourlyForecastItem | null>(null);
  const [scrubbedIndex, setScrubbedIndex] = useState<number | null>(null);

  useEffect(() => {
    document.body.classList.remove('theme-obsidian', 'theme-titanium', 'theme-cyberpunk');
    document.body.classList.add(`theme-${currentTheme}`);
  }, [currentTheme]);

  // Reset scrubbed timeline on city switch
  useEffect(() => {
    setScrubbedHour(null);
    setScrubbedIndex(null);
  }, [city]);

  // Jarvis AI Voice Audio Briefing
  const handleToggleAudioBriefing = () => {
    if (isPlayingAudio) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
      return;
    }

    if (!forecast) return;

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const temp = unit === 'C' ? Math.round(forecast.current.temperature) : Math.round((forecast.current.temperature * 9) / 5 + 32);
      const unitWord = unit === 'C' ? 'degrees Celsius' : 'degrees Fahrenheit';
      const rainProb = mlPrediction?.rainfall_prediction?.rain_probability_pct ?? 12;
      const rainStatus = mlPrediction?.rainfall_prediction?.will_rain ? 'Precipitation is likely.' : 'Dry meteorological conditions are expected.';
      const nextTemp = mlPrediction?.temperature_prediction ? `${mlPrediction.temperature_prediction.predicted_temp_celsius} degrees Celsius` : 'steady temperatures';

      const speechScript = `Greetings from WeatherGPT. In ${city.name}, current observation reports ${temp} ${unitWord} with ${forecast.current.condition}. Relative humidity is at ${forecast.current.humidity} percent, and winds are blowing at ${forecast.current.windSpeed} kilometers per hour. According to our scikit-learn machine learning engine, tomorrow's mean temperature is predicted at ${nextTemp} with a ${rainProb} percent chance of rain. ${rainStatus} Have a wonderful and productive day!`;

      const utterance = new SpeechSynthesisUtterance(speechScript);
      utterance.rate = 0.98;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        setIsPlayingAudio(false);
      };
      utterance.onerror = () => {
        setIsPlayingAudio(false);
      };

      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    }
  };

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
    <div className="min-h-screen flex flex-col justify-between relative overflow-x-hidden selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Living Atmospheric Particle Canvas */}
      <AtmosphericParticleCanvas
        condition={forecast?.current.condition}
        isDay={forecast?.current.isDay}
        rainIntensity={forecast?.current.precipitation}
      />

      {/* Dynamic Floating Telemetry Island (Apple VisionOS / Sequoia Capsule) */}
      <DynamicIslandCapsule
        city={city}
        forecast={forecast}
        mlPrediction={mlPrediction}
        unit={unit}
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
        onNavigateTab={setActiveTab}
        onPlayAudioBriefing={handleToggleAudioBriefing}
        isPlayingAudio={isPlayingAudio}
      />

      {/* Jarvis Voice Audio Floating Equalizer Player */}
      <AudioBriefingPlayer
        city={city}
        forecast={forecast}
        mlPrediction={mlPrediction}
        unit={unit}
        isPlaying={isPlayingAudio}
        onTogglePlay={handleToggleAudioBriefing}
      />

      {/* Background Ambient Aurora Glow Orbs */}
      <div className="fixed top-0 left-1/4 w-[650px] h-[450px] bg-gradient-to-tr from-blue-600/15 via-indigo-600/10 to-transparent blur-[120px] pointer-events-none rounded-full -z-10" />
      <div className="fixed top-72 right-1/4 w-[550px] h-[400px] bg-gradient-to-bl from-cyan-500/12 via-purple-600/10 to-transparent blur-[120px] pointer-events-none rounded-full -z-10" />
      <div className="fixed bottom-10 left-1/3 w-[500px] h-[350px] bg-gradient-to-tr from-indigo-700/10 via-blue-500/10 to-transparent blur-[140px] pointer-events-none rounded-full -z-10" />

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
          <div className="space-y-7">
            
            {/* Command Bar Search */}
            <SearchBar onSelectCity={handleSelectCity} currentCityName={city.name} />

            {/* Error Banner */}
            {error && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center justify-between shadow-lg">
                <span className="flex items-center space-x-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </span>
                <button
                  onClick={() => fetchWeatherData(city.latitude, city.longitude, city.name)}
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-rose-600/30"
                >
                  Retry Connection
                </button>
              </div>
            )}

            {/* Loading Skeleton */}
            {isLoading && !forecast && (
              <div className="space-y-6 animate-pulse">
                <div className="h-72 glass-panel rounded-[2rem] border border-white/[0.08]" />
                <div className="h-40 glass-panel rounded-[2rem] border border-white/[0.08]" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="h-80 glass-panel rounded-[2rem] border border-white/[0.08]" />
                  <div className="h-80 glass-panel rounded-[2rem] border border-white/[0.08]" />
                </div>
              </div>
            )}

            {/* Weather Content */}
            {forecast && (
              <div className="space-y-7">
                
                {/* Hero Current Weather Card */}
                <CurrentWeatherCard
                  cityName={city.name}
                  admin1={city.admin1}
                  country={city.country}
                  current={forecast.current}
                  todayDaily={forecast.daily[0]}
                  unit={unit}
                  overrideHourlyItem={scrubbedHour}
                />

                {/* Futuristic Glowing Orb Action Dock */}
                <div className="flex flex-col items-center justify-center -my-1">
                  <OrbActionsDock
                    city={city}
                    forecast={forecast}
                    mlPrediction={mlPrediction}
                    onNavigateTab={(tab) => setActiveTab(tab)}
                  />
                </div>

                {/* 24-Hour Interactive Atmospheric Time Scrubber */}
                <TimeMachineScrubber
                  hourly={forecast.hourly}
                  unit={unit}
                  onSelectHour={(item, idx) => {
                    setScrubbedHour(item);
                    setScrubbedIndex(idx);
                  }}
                  selectedHourIndex={scrubbedIndex}
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 items-start">
                  <DailyForecast daily={forecast.daily} unit={unit} />
                  <WeatherMetricsGrid current={forecast.current} todayDaily={forecast.daily[0]} />
                </div>

              </div>
            )}

          </div>
        )}

        {/* TAB 2: MACHINE LEARNING PREDICTIONS */}
        {activeTab === 'ml' && (
          <div className="space-y-7">
            <MLInsightsCard
              prediction={mlPrediction}
              metrics={mlMetrics}
              unit={unit === 'C' ? 'celsius' : 'fahrenheit'}
              isLoading={isMlLoading}
            />

            <div className="w-full glass-card rounded-[2rem] p-7 md:p-10 relative overflow-hidden">
              <div className="flex items-center space-x-3.5 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-2xl shadow-inner">
                  🧠
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">Custom Machine Learning Engine Architecture</h2>
                  <p className="text-xs text-slate-400 font-medium">Scikit-learn Regressors &amp; Classifiers trained on 2019-2024 Jalandhar Climate Archive</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="p-6 rounded-2xl bg-blue-950/20 border border-blue-500/30 shadow-inner">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-base font-bold text-blue-300">Model A: Temperature Regressor</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 font-bold">Regression</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    Linear Regression outperformed Random Forest Regressor on chronological 2024 unseen test split with <strong>R² = 0.9750</strong> and <strong>MAE = 1.048°C</strong>.
                  </p>
                  <div className="text-xs font-mono text-slate-300 bg-slate-950/80 p-3.5 rounded-xl border border-white/[0.08] space-y-1.5 shadow-inner">
                    <div className="text-cyan-400 font-bold">Winning Model: LinearRegression</div>
                    <div>Validation MAE: 1.048 °C</div>
                    <div>Validation R²: 0.9750 (97.5% Explained Variance)</div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 shadow-inner">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-base font-bold text-emerald-300">Model B: Rainfall Classifier</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold">Classification</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    Logistic Regression with balanced class weights achieved <strong>83.56% Accuracy</strong> and <strong>0.7115 F1 Score</strong> on 365 days of unseen 2024 test observations.
                  </p>
                  <div className="text-xs font-mono text-slate-300 bg-slate-950/80 p-3.5 rounded-xl border border-white/[0.08] space-y-1.5 shadow-inner">
                    <div className="text-emerald-400 font-bold">Winning Model: LogisticRegression (Balanced)</div>
                    <div>Validation Accuracy: 83.56%</div>
                    <div>ROC AUC Score: 0.8362 (High Discriminative Power)</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]"
                >
                  Return to Weather Dashboard
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

      {/* 3. High-End Academic Footer */}
      <footer className="border-t border-white/[0.08] bg-slate-950/80 backdrop-blur-2xl py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-white tracking-tight">WeatherGPT</span>
            <span>•</span>
            <span className="text-slate-400">Lovely Professional University (LPU)</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-cyan-300 text-[10px] font-bold border border-cyan-500/20">
              B.Tech AI &amp; ML
            </span>
          </div>
          <div className="text-slate-400 font-medium">
            Project Lead: <strong className="text-slate-100 font-bold">Rahul Choudhary (12504340)</strong> | Team: Gurbani, Karamjit, Tisha
          </div>
        </div>
      </footer>

    </div>
  );
}
