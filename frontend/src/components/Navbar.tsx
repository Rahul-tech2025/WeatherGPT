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
    <header className="sticky top-0 z-50 backdrop-blur-2xl bg-slate-950/75 border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div 
            className="flex items-center space-x-3.5 cursor-pointer group" 
            onClick={() => onTabChange('dashboard')}
          >
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30 ring-1 ring-white/30 group-hover:scale-105 transition-transform duration-300">
                <span className="text-2xl filter drop-shadow">🌦️</span>
              </div>
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 opacity-20 blur group-hover:opacity-40 transition duration-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  WeatherGPT
                </span>
                <span className="px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase rounded-full bg-blue-500/10 text-cyan-300 border border-cyan-500/30">
                  LPU CSE276
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-tight">AI Weather & ML Intelligence</p>
            </div>
          </div>

          {/* Navigation Tabs (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-1.5 p-1.5 rounded-2xl bg-slate-900/60 border border-white/[0.08] backdrop-blur-xl shadow-inner">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`relative flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 ring-1 ring-white/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.05]'
                  }`}
                >
                  <span className="text-sm">{tab.icon}</span>
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800/80 text-cyan-300 border border-cyan-500/20'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Unit Toggle & Live Status Pill */}
          <div className="flex items-center space-x-3">
            {/* Sliding Pill Unit Switch */}
            <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-white/[0.08] shadow-inner">
              <button
                onClick={() => temperatureUnit !== 'C' && onToggleUnit()}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  temperatureUnit === 'C'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40 ring-1 ring-white/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                °C
              </button>
              <button
                onClick={() => temperatureUnit !== 'F' && onToggleUnit()}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  temperatureUnit === 'F'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40 ring-1 ring-white/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                °F
              </button>
            </div>

            {/* Live Indicator */}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-[11px] tracking-tight">Telemetry Live</span>
            </div>
          </div>

        </div>

        {/* Mobile Navigation Scrollbar */}
        <div className="lg:hidden flex items-center space-x-2 py-2.5 overflow-x-auto no-scrollbar border-t border-white/[0.05]">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex-shrink-0 flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-900/60 text-slate-400 border border-white/[0.05]'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
