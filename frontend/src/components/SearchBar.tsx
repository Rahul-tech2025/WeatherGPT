'use strict';
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { searchCities } from '../services/api';
import { CitySearchResult } from '../types/weather';

interface SearchBarProps {
  onSelectCity: (city: CitySearchResult) => void;
  currentCityName: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSelectCity, currentCityName }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CitySearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const quickCities = [
    { name: 'Jalandhar', lat: 31.3256, lon: 75.5792, admin1: 'Punjab', country: 'India' },
    { name: 'New Delhi', lat: 28.6139, lon: 77.2090, admin1: 'Delhi', country: 'India' },
    { name: 'Mumbai', lat: 19.0760, lon: 72.8777, admin1: 'Maharashtra', country: 'India' },
    { name: 'Bengaluru', lat: 12.9716, lon: 77.5946, admin1: 'Karnataka', country: 'India' },
    { name: 'London', lat: 51.5074, lon: -0.1278, admin1: 'England', country: 'United Kingdom' }
  ];

  // Debounced search
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const data = await searchCities(query);
        setResults(data);
        setIsOpen(true);
      } catch (err) {
        console.error('Error in search:', err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: CitySearchResult) => {
    onSelectCity(city);
    setQuery('');
    setIsOpen(false);
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onSelectCity({
            id: 0,
            name: 'Your Current Location',
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            country: '',
            countryCode: '',
            admin1: '',
            timezone: 'auto',
            elevation: 0,
            population: 0
          });
        },
        () => {
          alert('Could not access current location. Please select a city manually.');
        }
      );
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto relative mb-7" ref={dropdownRef}>
      
      {/* Command Bar Search Container */}
      <div className="relative flex items-center group">
        <div className="absolute left-4.5 text-slate-400 group-focus-within:text-cyan-400 transition-colors pointer-events-none">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder={`Search global city or coordinates (current: ${currentCityName})...`}
          className="w-full pl-12 pr-28 py-4 bg-slate-900/60 backdrop-blur-2xl border border-white/[0.08] hover:border-white/15 focus:border-cyan-500/50 rounded-2xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/15 transition-all shadow-2xl text-sm font-medium"
        />

        <div className="absolute right-3.5 flex items-center space-x-2">
          {isLoading && (
            <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          )}
          <button
            type="button"
            onClick={handleLocateMe}
            title="Auto-detect GPS location"
            className="flex items-center space-x-1 px-3 py-1.5 bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition border border-white/10 shadow-sm"
          >
            <span>📍</span>
            <span className="hidden sm:inline font-bold">GPS</span>
          </button>
        </div>
      </div>

      {/* Autocomplete Glass Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-slate-950/90 backdrop-blur-3xl border border-white/[0.1] rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.8)] z-50 overflow-hidden divide-y divide-white/[0.04] animate-in fade-in zoom-in-95 duration-200">
          <div className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-white/[0.02]">
            Suggested Metropolises
          </div>
          <div className="max-h-72 overflow-y-auto">
            {results.map((city) => (
              <button
                key={`${city.id}-${city.name}-${city.latitude}`}
                onClick={() => handleSelect(city)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-cyan-500/10 hover:border-l-4 hover:border-cyan-400 text-left transition duration-150 group"
              >
                <div>
                  <div className="font-bold text-slate-100 group-hover:text-cyan-300 text-sm flex items-center space-x-2">
                    <span>{city.name}</span>
                    {city.countryCode && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-slate-300 font-mono font-bold">
                        {city.countryCode}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {[city.admin1, city.country].filter(Boolean).join(', ')}
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 font-mono text-right">
                  {city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Select Region Pills */}
      <div className="flex items-center space-x-2 mt-3.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider whitespace-nowrap pl-1">Popular:</span>
        {quickCities.map((c) => (
          <button
            key={c.name}
            onClick={() =>
              handleSelect({
                id: Math.random(),
                name: c.name,
                latitude: c.lat,
                longitude: c.lon,
                admin1: c.admin1,
                country: c.country,
                countryCode: '',
                timezone: 'auto',
                elevation: 0,
                population: 0
              })
            }
            className="px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-cyan-500/30 text-slate-300 hover:text-white whitespace-nowrap transition duration-200 font-medium"
          >
            {c.name}
          </button>
        ))}
      </div>

    </div>
  );
};
