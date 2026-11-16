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
        <svg className={`${className} text-amber-400`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      );
    case 'clear-night':
      return (
        <svg className={`${className} text-indigo-300`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      );
    case 'partly-cloudy-day':
      return (
        <svg className={`${className} text-amber-300`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
          <path d="M12 2v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="M2 12h2" />
        </svg>
      );
    case 'cloudy':
      return (
        <svg className={`${className} text-slate-300`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
        </svg>
      );
    case 'fog':
      return (
        <svg className={`${className} text-slate-400`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="8" x2="21" y2="8" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="16" x2="21" y2="16" />
        </svg>
      );
    case 'drizzle':
    case 'rain-light':
      return (
        <svg className={`${className} text-sky-400`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
          <line x1="8" y1="20" x2="8" y2="22" />
          <line x1="12" y1="20" x2="12" y2="22" />
          <line x1="16" y1="20" x2="16" y2="22" />
        </svg>
      );
    case 'rain-moderate':
    case 'rain-heavy':
    case 'showers':
    case 'showers-heavy':
      return (
        <svg className={`${className} text-blue-400`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
          <line x1="8" y1="19" x2="6" y2="23" strokeWidth="2.5" />
          <line x1="12" y1="19" x2="10" y2="23" strokeWidth="2.5" />
          <line x1="16" y1="19" x2="14" y2="23" strokeWidth="2.5" />
        </svg>
      );
    case 'thunderstorm':
    case 'thunderstorm-hail':
      return (
        <svg className={`${className} text-amber-400`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
          <polyline points="13 14 10 19 14 19 11 23" />
        </svg>
      );
    case 'snow':
    case 'snow-showers':
    case 'snow-heavy':
      return (
        <svg className={`${className} text-cyan-200`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
          <circle cx="8" cy="21" r="1" fill="currentColor" />
          <circle cx="12" cy="21" r="1" fill="currentColor" />
          <circle cx="16" cy="21" r="1" fill="currentColor" />
        </svg>
      );
    default:
      return (
        <svg className={`${className} text-blue-300`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
        </svg>
      );
  }
};
