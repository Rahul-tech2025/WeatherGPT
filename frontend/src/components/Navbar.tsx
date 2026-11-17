'use strict';
'use client';

import React from 'react';

interface NavbarProps {
  temperatureUnit: 'C' | 'F';
  onToggleUnit: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  temperatureUnit,
  onToggleUnit,
  activeTab,
  onTabChange
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '🌤️' },
    { id: 'ml', label: 'ML Predictions', icon: '🧠', badge: 'Custom ML' },
    { id: 'chat', label: 'AI Assistant', icon: '🤖', badge: 'Gemini' },
    { id: 'compare', label: 'City Compare', icon: '⚖️' },
    { id: 'history', label: 'Analytics', icon: '📈' },
    { id: 'map', label: 'Live Radar', icon: '🗺️' },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onTabChange('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25 ring-1 ring-white/20">
              <span className="text-xl">🌦️</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  WeatherGPT
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  LPU Mini-Project
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Conversational Weather & ML Intelligence</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800/80">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`relative flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Unit Toggle & Live Indicator */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleUnit}
              className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs font-semibold text-slate-300 hover:border-slate-700 transition"
              title="Toggle Temperature Unit"
            >
              <span className={`px-2 py-1 rounded ${temperatureUnit === 'C' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400'}`}>
                °C
              </span>
              <span className={`px-2 py-1 rounded ${temperatureUnit === 'F' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400'}`}>
                °F
              </span>
            </button>

            <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-medium text-[11px]">Live Open-Meteo</span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
