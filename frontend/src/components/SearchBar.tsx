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
    }, 350);

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
    <div className="w-full max-w-2xl mx-auto relative mb-6" ref={dropdownRef}>
      
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <div className="absolute left-4 text-slate-400 pointer-events-none">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder={`Search city or country (current: ${currentCityName})...`}
          className="w-full pl-12 pr-28 py-3.5 bg-slate-900/90 border border-slate-700/80 rounded-2xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-xl shadow-black/20 text-sm font-medium"
        />

        <div className="absolute right-3 flex items-center space-x-1.5">
          {isLoading && (
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-1"></div>
          )}
          <button
            type="button"
            onClick={handleLocateMe}
            title="Use My Location"
            className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition border border-slate-700"
          >
            <span>📍</span>
            <span className="hidden sm:inline">GPS</span>
          </button>
        </div>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-800">
          <div className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-800/40">
            Suggested Locations
          </div>
          <div className="max-h-64 overflow-y-auto">
            {results.map((city) => (
              <button
                key={`${city.id}-${city.name}-${city.latitude}`}
                onClick={() => handleSelect(city)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-blue-600/10 hover:border-l-4 hover:border-blue-500 text-left transition duration-150 group"
              >
                <div>
                  <div className="font-semibold text-slate-100 group-hover:text-blue-400 text-sm flex items-center space-x-2">
                    <span>{city.name}</span>
                    {city.countryCode && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        {city.countryCode}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400">
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

      {/* Quick Select Chips */}
      <div className="flex items-center space-x-2 mt-3 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-slate-400 font-medium text-[11px] whitespace-nowrap">Popular:</span>
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
            className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 hover:text-white whitespace-nowrap transition duration-150"
          >
            {c.name}
          </button>
        ))}
      </div>

    </div>
  );
};
