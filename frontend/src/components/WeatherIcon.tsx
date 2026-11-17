'use strict';
'use client';

import React from 'react';

interface WeatherIconProps {
  icon: string;
  className?: string;
  isDay?: boolean;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ icon, className = 'w-8 h-8', isDay = true }) => {
  const resolvedIcon = (icon === 'clear-day' && !isDay) ? 'clear-night' : icon;

  switch (resolvedIcon) {
    case 'clear-day':
      return (
        <svg className={`${className} filter drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]`} viewBox="0 0 64 64" fill="none">
          <defs>
            <radialGradient id="sun-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff" />
              <stop offset="30%" stopColor="#fef08a" />
              <stop offset="70%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </radialGradient>
            <linearGradient id="sun-ray" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          {/* Rays */}
          <g stroke="url(#sun-ray)" strokeWidth="3" strokeLinecap="round" opacity="0.85">
            <line x1="32" y1="6" x2="32" y2="12" />
            <line x1="32" y1="52" x2="32" y2="58" />
            <line x1="6" y1="32" x2="12" y2="32" />
            <line x1="52" y1="32" x2="58" y2="32" />
            <line x1="13.6" y1="13.6" x2="17.8" y2="17.8" />
            <line x1="46.2" y1="46.2" x2="50.4" y2="50.4" />
            <line x1="13.6" y1="50.4" x2="17.8" y2="46.2" />
            <line x1="46.2" y1="17.8" x2="50.4" y2="13.6" />
          </g>
          {/* Sun Sphere */}
          <circle cx="32" cy="32" r="16" fill="url(#sun-core)" />
        </svg>
      );

    case 'clear-night':
      return (
        <svg className={`${className} filter drop-shadow-[0_0_12px_rgba(147,197,253,0.4)]`} viewBox="0 0 64 64" fill="none">
          <defs>
            <linearGradient id="moon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="50%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>
          </defs>
          <path
            d="M44 38.5C41.2 46.5 32.5 50.8 24.5 48C17.5 45.5 13 38.8 13.5 31.5C13.8 26.2 16.8 21.5 21.5 19C20.8 22.8 21.8 26.8 24.5 29.5C28.2 33.2 33.8 34.5 38.5 32.8C41.2 33.5 43.2 35.8 44 38.5Z"
            fill="url(#moon-grad)"
          />
          <circle cx="48" cy="18" r="1.5" fill="#f8fafc" opacity="0.8" />
          <circle cx="52" cy="28" r="1" fill="#f8fafc" opacity="0.6" />
          <circle cx="42" cy="12" r="1" fill="#f8fafc" opacity="0.5" />
        </svg>
      );

    case 'partly-cloudy-day':
      return (
        <svg className={`${className} filter drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]`} viewBox="0 0 64 64" fill="none">
          <defs>
            <radialGradient id="partial-sun" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#f59e0b" />
            </radialGradient>
            <linearGradient id="cloud-front" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
          </defs>
          {/* Peeking Sun */}
          <circle cx="42" cy="24" r="12" fill="url(#partial-sun)" />
          {/* Cloud */}
          <path
            d="M48 48H18C12.5 48 8 43.5 8 38C8 33 11.8 28.8 16.8 28.1C18.5 20.8 25.2 15.5 33 16C39.5 16.4 45 20.8 46.5 27.2C50.8 28 54 31.8 54 36.5C54 42.8 49 48 48 48Z"
            fill="url(#cloud-front)"
            opacity="0.95"
          />
        </svg>
      );

    case 'partly-cloudy-night':
      return (
        <svg className={`${className} filter drop-shadow-[0_0_10px_rgba(147,197,253,0.3)]`} viewBox="0 0 64 64" fill="none">
          <defs>
            <linearGradient id="cloud-night" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
          </defs>
          <path d="M38 18C36 21 36.5 24.5 38.5 26.5C40.5 28.5 44 29 47 27C44 32 38 35 32 33" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
          <path
            d="M48 48H18C12.5 48 8 43.5 8 38C8 33 11.8 28.8 16.8 28.1C18.5 20.8 25.2 15.5 33 16C39.5 16.4 45 20.8 46.5 27.2C50.8 28 54 31.8 54 36.5C54 42.8 49 48 48 48Z"
            fill="url(#cloud-night)"
          />
        </svg>
      );

    case 'cloudy':
    case 'overcast':
      return (
        <svg className={`${className} filter drop-shadow`} viewBox="0 0 64 64" fill="none">
          <defs>
            <linearGradient id="overcast-cloud" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="60%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>
            <linearGradient id="back-cloud" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
          </defs>
          <path
            d="M42 36H24C20 36 17 33 17 29C17 25.5 19.5 22.5 23 22C24.5 16.5 29.5 12.5 35 13C39.5 13.5 43.5 16.8 44.5 21.5C47.5 22 50 24.8 50 28C50 32.5 46.5 36 42 36Z"
            fill="url(#back-cloud)"
            opacity="0.75"
          />
          <path
            d="M48 50H18C12.5 50 8 45.5 8 40C8 35 11.8 30.8 16.8 30.1C18.5 22.8 25.2 17.5 33 18C39.5 18.4 45 22.8 46.5 29.2C50.8 30 54 33.8 54 38.5C54 44.8 49 50 48 50Z"
            fill="url(#overcast-cloud)"
          />
        </svg>
      );

    case 'rain':
    case 'drizzle':
    case 'rain-light':
    case 'rain-heavy':
      return (
        <svg className={`${className} filter drop-shadow-[0_0_10px_rgba(56,189,248,0.35)]`} viewBox="0 0 64 64" fill="none">
          <defs>
            <linearGradient id="rain-cloud" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
            <linearGradient id="rain-drop" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>
          <path
            d="M48 42H18C12.5 42 8 37.5 8 32C8 27 11.8 22.8 16.8 22.1C18.5 14.8 25.2 9.5 33 10C39.5 10.4 45 14.8 46.5 21.2C50.8 22 54 25.8 54 30.5C54 36.8 49 42 48 42Z"
            fill="url(#rain-cloud)"
          />
          {/* Glowing Rain Drops */}
          <line x1="20" y1="46" x2="16" y2="56" stroke="url(#rain-drop)" strokeWidth="3" strokeLinecap="round" />
          <line x1="32" y1="46" x2="28" y2="56" stroke="url(#rain-drop)" strokeWidth="3" strokeLinecap="round" />
          <line x1="44" y1="46" x2="40" y2="56" stroke="url(#rain-drop)" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'thunderstorm':
      return (
        <svg className={`${className} filter drop-shadow-[0_0_14px_rgba(234,179,8,0.5)]`} viewBox="0 0 64 64" fill="none">
          <defs>
            <linearGradient id="thunder-cloud" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
            <linearGradient id="lightning-bolt" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
          <path
            d="M48 40H18C12.5 40 8 35.5 8 30C8 25 11.8 20.8 16.8 20.1C18.5 12.8 25.2 7.5 33 8C39.5 8.4 45 12.8 46.5 19.2C50.8 20 54 23.8 54 28.5C54 34.8 49 40 48 40Z"
            fill="url(#thunder-cloud)"
          />
          {/* Lightning Bolt */}
          <path
            d="M34 34L24 46H32L28 58L42 44H34L38 34H34Z"
            fill="url(#lightning-bolt)"
            stroke="#fef08a"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'snow':
      return (
        <svg className={`${className} filter drop-shadow-[0_0_10px_rgba(186,230,253,0.5)]`} viewBox="0 0 64 64" fill="none">
          <defs>
            <linearGradient id="snow-cloud" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f1f5f9" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
          </defs>
          <path
            d="M48 40H18C12.5 40 8 35.5 8 30C8 25 11.8 20.8 16.8 20.1C18.5 12.8 25.2 7.5 33 8C39.5 8.4 45 12.8 46.5 19.2C50.8 20 54 23.8 54 28.5C54 34.8 49 40 48 40Z"
            fill="url(#snow-cloud)"
          />
          <circle cx="22" cy="48" r="2.5" fill="#e0f2fe" />
          <circle cx="34" cy="52" r="2" fill="#e0f2fe" />
          <circle cx="44" cy="48" r="2.5" fill="#e0f2fe" />
        </svg>
      );

    case 'fog':
    case 'mist':
      return (
        <svg className={`${className} filter drop-shadow`} viewBox="0 0 64 64" fill="none">
          <defs>
            <linearGradient id="fog-line" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#cbd5e1" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <rect x="10" y="22" width="44" height="4" rx="2" fill="url(#fog-line)" />
          <rect x="14" y="30" width="36" height="4" rx="2" fill="url(#fog-line)" />
          <rect x="8" y="38" width="48" height="4" rx="2" fill="url(#fog-line)" />
          <rect x="16" y="46" width="32" height="4" rx="2" fill="url(#fog-line)" />
        </svg>
      );

    default:
      return (
        <svg className={`${className} text-cyan-400`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
        </svg>
      );
  }
};
