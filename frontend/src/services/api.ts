import { CitySearchResult, ForecastData } from '../types/weather';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Search cities using backend API with fallback to Open-Meteo Geocoding directly
 */
export async function searchCities(query: string): Promise<CitySearchResult[]> {
  if (!query || query.trim().length === 0) return [];

  try {
    const res = await fetch(`${BACKEND_BASE_URL}/weather/search?city=${encodeURIComponent(query)}`);
    if (res.ok) {
      const json = await res.json();
      return json.data || [];
    }
  } catch (err) {
    console.warn('Backend search API unreachable, using direct geocoding fallback:', err);
  }

  // Direct Open-Meteo Geocoding fallback
  try {
    const fallbackRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
    );
    const data = await fallbackRes.json();
    if (!data.results) return [];

    return data.results.map((c: {
      id: number;
      name: string;
      latitude: number;
      longitude: number;
      country?: string;
      country_code?: string;
      admin1?: string;
      timezone?: string;
      elevation?: number;
      population?: number;
    }) => ({
      id: c.id,
      name: c.name,
      latitude: c.latitude,
      longitude: c.longitude,
      country: c.country || '',
      countryCode: c.country_code || '',
      admin1: c.admin1 || '',
      timezone: c.timezone || 'auto',
      elevation: c.elevation || 0,
      population: c.population || 0
    }));
  } catch (fallbackErr) {
    console.error('All geocoding lookups failed:', fallbackErr);
    return [];
  }
}

/**
 * Fetch 7-day and 24-hour weather forecast
 */
export async function getForecast(latitude: number, longitude: number): Promise<ForecastData> {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/weather/forecast?lat=${latitude}&lon=${longitude}`);
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch (err) {
    console.warn('Backend forecast API unreachable, using direct Open-Meteo fallback:', err);
  }

  // Direct Open-Meteo API fallback
  const directUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,surface_pressure,visibility,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,rain_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;

  const fallbackRes = await fetch(directUrl);
  if (!fallbackRes.ok) {
    throw new Error('Failed to fetch weather forecast from both backend and provider.');
  }

  const data = await fallbackRes.json();
  const current = data.current;

  // Simple condition mapper for direct fallback
  const mapCode = (code: number) => {
    if (code === 0) return { description: 'Clear sky', icon: 'clear-day', category: 'Clear' };
    if (code <= 3) return { description: 'Partly cloudy', icon: 'partly-cloudy-day', category: 'Cloudy' };
    if (code <= 48) return { description: 'Foggy', icon: 'fog', category: 'Fog' };
    if (code <= 57) return { description: 'Drizzle', icon: 'drizzle', category: 'Drizzle' };
    if (code <= 67) return { description: 'Rain', icon: 'rain-moderate', category: 'Rain' };
    if (code <= 77) return { description: 'Snow fall', icon: 'snow', category: 'Snow' };
    if (code <= 82) return { description: 'Rain showers', icon: 'showers', category: 'Rain' };
    if (code <= 86) return { description: 'Snow showers', icon: 'snow-showers', category: 'Snow' };
    return { description: 'Thunderstorm', icon: 'thunderstorm', category: 'Thunderstorm' };
  };

  const currentCond = mapCode(current.weather_code);

  const hourlyData = [];
  const currentHourIso = new Date().toISOString().slice(0, 13);
  let startIndex = data.hourly.time.findIndex((t: string) => t.startsWith(currentHourIso));
  if (startIndex === -1) startIndex = 0;

  for (let i = startIndex; i < Math.min(startIndex + 24, data.hourly.time.length); i++) {
    const code = data.hourly.weather_code[i];
    const cond = mapCode(code);
    hourlyData.push({
      time: data.hourly.time[i],
      temperature: data.hourly.temperature_2m[i],
      feelsLike: data.hourly.apparent_temperature[i],
      humidity: data.hourly.relative_humidity_2m[i],
      precipitationProbability: data.hourly.precipitation_probability[i],
      precipitation: data.hourly.precipitation[i],
      pressure: data.hourly.surface_pressure[i],
      visibility: data.hourly.visibility ? data.hourly.visibility[i] / 1000 : null,
      windSpeed: data.hourly.wind_speed_10m[i],
      weatherCode: code,
      condition: cond.description,
      icon: cond.icon
    });
  }

  const dailyData = [];
  for (let i = 0; i < data.daily.time.length; i++) {
    const code = data.daily.weather_code[i];
    const cond = mapCode(code);
    dailyData.push({
      date: data.daily.time[i],
      tempMax: data.daily.temperature_2m_max[i],
      tempMin: data.daily.temperature_2m_min[i],
      apparentTempMax: data.daily.apparent_temperature_max[i],
      apparentTempMin: data.daily.apparent_temperature_min[i],
      precipitationSum: data.daily.precipitation_sum[i],
      rainSum: data.daily.rain_sum[i],
      precipitationProbabilityMax: data.daily.precipitation_probability_max[i],
      windSpeedMax: data.daily.wind_speed_10m_max[i],
      sunrise: data.daily.sunrise[i],
      sunset: data.daily.sunset[i],
      uvIndexMax: data.daily.uv_index_max[i],
      weatherCode: code,
      condition: cond.description,
      icon: cond.icon,
      category: cond.category
    });
  }

  return {
    latitude: data.latitude,
    longitude: data.longitude,
    timezone: data.timezone,
    elevation: data.elevation,
    current: {
      time: current.time,
      temperature: current.temperature_2m,
      feelsLike: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      precipitation: current.precipitation,
      rain: current.rain,
      pressure: current.surface_pressure,
      windSpeed: current.wind_speed_10m,
      windDirection: current.wind_direction_10m,
      isDay: current.is_day === 1,
      weatherCode: current.weather_code,
      condition: currentCond.description,
      icon: currentCond.icon,
      category: currentCond.category
    },
    hourly: hourlyData,
    daily: dailyData
  };
}
