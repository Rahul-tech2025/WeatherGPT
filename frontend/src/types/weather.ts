export interface CitySearchResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  countryCode: string;
  admin1: string;
  timezone: string;
  elevation: number;
  population: number;
}

export interface CurrentWeather {
  time: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  precipitation: number;
  rain: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  isDay: boolean;
  weatherCode: number;
  condition: string;
  icon: string;
  category: string;
}

export interface TodaySummary {
  tempMax: number;
  tempMin: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
}

export interface HourlyForecastItem {
  time: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  precipitationProbability: number;
  precipitation: number;
  pressure: number;
  visibility: number | null;
  windSpeed: number;
  weatherCode: number;
  condition: string;
  icon: string;
}

export interface DailyForecastItem {
  date: string;
  tempMax: number;
  tempMin: number;
  apparentTempMax: number;
  apparentTempMin: number;
  precipitationSum: number;
  rainSum: number;
  precipitationProbabilityMax: number;
  windSpeedMax: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
  weatherCode: number;
  condition: string;
  icon: string;
  category: string;
}

export interface ForecastData {
  latitude: number;
  longitude: number;
  timezone: string;
  elevation: number;
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
}
