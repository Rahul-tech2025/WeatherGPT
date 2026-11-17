'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useRef, useState } from 'react';
import { CitySearchResult, ForecastData } from '../types/weather';
import { getForecast } from '../services/api';
import { WeatherIcon } from './WeatherIcon';

interface WeatherMapViewProps {
  city: CitySearchResult;
  unit: 'C' | 'F';
  onSelectCity?: (city: CitySearchResult) => void;
}

type MapLayerType = 'dark' | 'standard' | 'satellite';

const TILE_SERVERS: Record<MapLayerType, { url: string; attribution: string; maxZoom: number }> = {
  dark: {
    url: 'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 16
  },
  standard: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, Maxar, Earthstar Geographics',
    maxZoom: 18
  }
};

export default function WeatherMapView({ city, unit, onSelectCity }: WeatherMapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const radarLayerRef = useRef<any>(null);

  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showRadar, setShowRadar] = useState<boolean>(true);
  const [mapLayer, setMapLayer] = useState<MapLayerType>('dark');
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lon: number; name: string }>({
    lat: city.latitude,
    lon: city.longitude,
    name: city.name
  });

  // Fetch forecast for clicked marker coordinate
  const loadCoordsWeather = async (lat: number, lon: number, name: string) => {
    setIsLoading(true);
    try {
      const data = await getForecast(lat, lon);
      setForecast(data);
      setSelectedCoords({ lat, lon, name });
    } catch (err) {
      console.error('Error fetching map forecast:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCoordsWeather(city.latitude, city.longitude, city.name);
  }, [city]);

  // Switch between Dark, Standard, and Satellite tile layers
  const changeMapLayer = (layerKey: MapLayerType) => {
    setMapLayer(layerKey);
    const map = mapInstanceRef.current;
    const L = (window as any).L;
    if (!map || !L) return;

    if (map._currentTileLayer) {
      map.removeLayer(map._currentTileLayer);
    }

    const conf = TILE_SERVERS[layerKey];
    const newTileLayer = L.tileLayer(conf.url, {
      attribution: conf.attribution,
      maxZoom: conf.maxZoom
    });

    newTileLayer.addTo(map);
    map._currentTileLayer = newTileLayer;

    // Keep radar and marker on top of the new basemap
    if (radarLayerRef.current && showRadar) {
      radarLayerRef.current.bringToFront();
    }
    if (markerRef.current) {
      markerRef.current.setZIndexOffset(1000);
    }
  };

  // Load Leaflet dynamically via CDN to prevent SSR window issues
  useEffect(() => {
    let isMounted = true;

    const loadLeaflet = async () => {
      // Add Leaflet CSS if not present
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Add Leaflet JS if not present
      if (!(window as any).L) {
        await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.onload = resolve;
          document.head.appendChild(script);
        });
      }

      if (!isMounted || !mapContainerRef.current) return;
      const L = (window as any).L;

      if (!mapInstanceRef.current) {
        // Initialize Map (Initial zoom 7 for optimal radar sharpness)
        const map = L.map(mapContainerRef.current, {
          zoomControl: false,
          minZoom: 2,
          maxZoom: 18
        }).setView([city.latitude, city.longitude], 7);

        L.control.zoom({ position: 'topright' }).addTo(map);

        // Tile layer (Free, High-Resolution, Zero API Keys)
        const initialConf = TILE_SERVERS[mapLayer];
        const tileLayer = L.tileLayer(initialConf.url, {
          attribution: initialConf.attribution,
          maxZoom: initialConf.maxZoom
        }).addTo(map);

        (map as any)._currentTileLayer = tileLayer;

        // Custom Glowing Pulse Marker
        const customIcon = L.divIcon({
          className: 'custom-weather-marker',
          html: `<div style="
            background: linear-gradient(135deg, #3b82f6, #06b6d4);
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 18px;
            box-shadow: 0 4px 14px rgba(59, 130, 246, 0.6);
            border: 2px solid white;
          ">📍</div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 36]
        });

        const marker = L.marker([city.latitude, city.longitude], {
          icon: customIcon,
          zIndexOffset: 1000
        }).addTo(map);
        markerRef.current = marker;

        // Map Click Listener
        map.on('click', async (e: any) => {
          const { lat, lng } = e.latlng;
          marker.setLatLng([lat, lng]);
          const locationName = `Coordinates (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`;
          loadCoordsWeather(lat, lng, locationName);
        });

        // Live RainViewer Precipitation Radar Overlay
        try {
          const radarRes = await fetch('https://api.rainviewer.com/public/weather-maps.json');
          if (radarRes.ok) {
            const radarData = await radarRes.json();
            if (radarData.radar?.past?.length > 0) {
              const latestPast = radarData.radar.past[radarData.radar.past.length - 1];
              const radarTileUrl = `https://tilecache.rainviewer.com${latestPast.path}/256/{z}/{x}/{y}/2/1_1.png`;
              const radar = L.tileLayer(radarTileUrl, {
                tileSize: 256,
                opacity: 0.65,
                zIndex: 100,
                minZoom: 1,
                maxZoom: 7 // Regional radar view (strictly caps at level 7 so RainViewer never sends "zoom level not supported" error)
              });
              radar.addTo(map);
              radarLayerRef.current = radar;
            }
          }
        } catch (err) {
          console.warn('RainViewer Radar layer could not be loaded:', err);
        }

        mapInstanceRef.current = map;

        // Trigger size invalidation to guarantee full container rendering
        setTimeout(() => map.invalidateSize(), 200);
        setTimeout(() => map.invalidateSize(), 600);
      } else {
        // Update view when city prop changes
        mapInstanceRef.current.setView([city.latitude, city.longitude], 7);
        if (markerRef.current) {
          markerRef.current.setLatLng([city.latitude, city.longitude]);
        }
        setTimeout(() => mapInstanceRef.current?.invalidateSize(), 150);
      }
    };

    loadLeaflet();

    return () => {
      isMounted = false;
    };
  }, [city.latitude, city.longitude]);

  // Toggle Radar Layer on/off
  const toggleRadar = () => {
    if (!radarLayerRef.current || !mapInstanceRef.current) return;
    if (showRadar) {
      mapInstanceRef.current.removeLayer(radarLayerRef.current);
      setShowRadar(false);
    } else {
      mapInstanceRef.current.addLayer(radarLayerRef.current);
      setShowRadar(true);
    }
  };

  const tempVal = (c: number) => (unit === 'F' ? Math.round((c * 9) / 5 + 32) : Math.round(c));

  return (
    <div className="space-y-6">
      {/* Header & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xl">🗺️</span>
            <h2 className="text-xl font-bold text-white tracking-tight">Interactive Weather Radar & GIS Map</h2>
            <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Live Doppler Overlay
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Click anywhere on the globe to inspect real-time microclimates or track precipitation storm clusters.
          </p>
        </div>

        {/* Map Controls: Layer Selector & Radar Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Layer Selector */}
          <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => changeMapLayer('dark')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                mapLayer === 'dark'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🌑 Dark
            </button>
            <button
              onClick={() => changeMapLayer('satellite')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                mapLayer === 'satellite'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🛰️ Satellite
            </button>
            <button
              onClick={() => changeMapLayer('standard')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                mapLayer === 'standard'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🗺️ Street
            </button>
          </div>

          {/* Radar Toggle Button */}
          <button
            onClick={toggleRadar}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              showRadar
                ? 'bg-blue-600/20 border-blue-500/40 text-blue-300 shadow-md shadow-blue-500/10'
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${showRadar ? 'bg-cyan-400 animate-pulse' : 'bg-slate-500'}`} />
            <span>{showRadar ? 'Rain Radar: Active' : 'Rain Radar: Hidden'}</span>
          </button>
        </div>
      </div>

      {/* Main Map Container & Floating Weather Inspector */}
      <div className="relative w-full h-[600px] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
        {/* Leaflet DOM Anchor */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Weather Inspector HUD */}
        <div className="absolute top-4 left-4 z-10 max-w-xs sm:max-w-sm w-full p-4 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-slate-800/90 shadow-2xl text-white">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Inspected Location</div>
              <h3 className="text-base font-bold text-white truncate">{selectedCoords.name}</h3>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/40">
              {selectedCoords.lat.toFixed(2)}°, {selectedCoords.lon.toFixed(2)}°
            </span>
          </div>

          {isLoading ? (
            <div className="py-6 flex items-center justify-center space-x-2 text-slate-400 text-xs">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span>Fetching regional telemetry...</span>
            </div>
          ) : forecast ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center border border-slate-700">
                    <WeatherIcon icon={forecast.current.icon} isDay={forecast.current.isDay} className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white">
                      {tempVal(forecast.current.temperature)}°{unit}
                    </div>
                    <div className="text-xs text-slate-400 font-medium">{forecast.current.condition}</div>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <div className="text-slate-400">Feels Like</div>
                  <div className="font-semibold text-slate-200">
                    {tempVal(forecast.current.feelsLike)}°{unit}
                  </div>
                </div>
              </div>

              {/* Quick Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">Humidity</span>
                  <span className="font-bold text-slate-200">{forecast.current.humidity}%</span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">Wind</span>
                  <span className="font-bold text-slate-200">{Math.round(forecast.current.windSpeed)} km/h</span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">Precip</span>
                  <span className="font-bold text-cyan-400">{forecast.current.precipitation} mm</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-rose-400 py-3 text-center">Telemetry unavailable for selected point</div>
          )}

          <div className="mt-3 pt-2 border-t border-slate-800/60 text-[10px] text-slate-400 text-center">
            💡 Tip: Click anywhere across the map to fetch real-time microclimate data
          </div>
        </div>

        {/* Floating Radar Intensity Legend */}
        {showRadar && (
          <div className="absolute bottom-4 right-4 z-10 p-3 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 text-[10px] text-slate-300 flex flex-col sm:flex-row items-start sm:items-center gap-2 shadow-2xl">
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-slate-400">Doppler Radar:</span>
              <div className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400 inline-block" />
                <span className="text-[9px]">Light</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block" />
                <span className="text-[9px]">Mod</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-purple-500 inline-block" />
                <span className="text-[9px]">Heavy</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-red-500 inline-block" />
                <span className="text-[9px]">Severe</span>
              </div>
            </div>
            <span className="hidden md:inline text-[9px] text-slate-400 border-l border-slate-700/80 pl-2">
              (Radar active at regional scale 1-7; auto-focuses on sharp base map when zoomed in)
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
