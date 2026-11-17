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
  onTabChange,
}) => {
  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="9" rx="1" />
          <rect x="14" y="3" width="7" height="5" rx="1" />
          <rect x="14" y="12" width="7" height="9" rx="1" />
          <rect x="3" y="16" width="7" height="5" rx="1" />
        </svg>
      ),
    },
    {
      id: 'ml',
      label: 'ML Engine',
      badge: 'Scikit-Learn',
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      ),
    },
    {
      id: 'chat',
      label: 'AI Assistant',
      badge: 'Gemini',
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      id: 'compare',
      label: 'City Compare',
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
        </svg>
      ),
    },
    {
      id: 'history',
      label: 'Analytics',
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
    },
    {
      id: 'map',
      label: 'Radar Map',
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
      ),
    },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-2xl bg-[#030508]/85 border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand (Space Aesthetic with Clean Geometry) */}
          <div
            className="flex items-center space-x-3.5 cursor-pointer group"
            onClick={() => onTabChange('dashboard')}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/20 flex items-center justify-center shadow-lg shadow-white/5 group-hover:border-white/40 transition-all duration-300">
                {/* Modern Geometric Satellite / Weather Aperture SVG */}
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <circle cx="12" cy="12" r="8" />
                  <path d="M12 2v4M12 18v4M2 12h4M18 12h4" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="2" fill="white" />
                </svg>
              </div>
              <div className="absolute -inset-0.5 rounded-xl bg-white/10 opacity-0 blur group-hover:opacity-100 transition duration-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-white">
                  WeatherGPT
                </span>
                <span className="px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase rounded-full bg-white/[0.08] text-slate-300 border border-white/15">
                  AI &amp; ML
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-tight">Meteorological Intelligence Platform</p>
            </div>
          </div>

          {/* Navigation Tabs (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-1 p-1.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl shadow-inner">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`relative flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-black shadow-lg shadow-white/10 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <span className={isActive ? 'text-black' : 'text-slate-400'}>{tab.icon}</span>
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-md font-mono font-bold tracking-wider ${
                        isActive
                          ? 'bg-black/10 text-black'
                          : 'bg-white/[0.06] text-slate-300 border border-white/10'
                      }`}
                    >
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
            <div className="flex items-center bg-white/[0.04] p-1 rounded-xl border border-white/[0.08] shadow-inner">
              <button
                onClick={() => temperatureUnit !== 'C' && onToggleUnit()}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  temperatureUnit === 'C'
                    ? 'bg-white text-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                °C
              </button>
              <button
                onClick={() => temperatureUnit !== 'F' && onToggleUnit()}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  temperatureUnit === 'F'
                    ? 'bg-white text-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                °F
              </button>
            </div>

            {/* Live Indicator */}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/15 text-slate-300 text-xs shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span className="font-semibold text-[11px] tracking-tight">Live Telemetry</span>
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
                    ? 'bg-white text-black shadow-md'
                    : 'bg-white/[0.04] text-slate-400 border border-white/[0.05]'
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
