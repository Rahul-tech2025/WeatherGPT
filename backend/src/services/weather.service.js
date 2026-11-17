const axios = require('axios');
const { getWeatherCondition } = require('../utils/wmoCodes');

const GEOCODING_BASE_URL = process.env.OPEN_METEO_GEO_URL || 'https://geocoding-api.open-meteo.com/v1';
const WEATHER_BASE_URL = process.env.OPEN_METEO_API_URL || 'https://api.open-meteo.com/v1';
const ARCHIVE_BASE_URL = 'https://archive-api.open-meteo.com/v1';

// Robust HTTP client with standard User-Agent to avoid datacenter IP throttling
const httpClient = axios.create({
  timeout: 12000,
  headers: {
    'User-Agent': 'WeatherGPT/1.0 (LPU Academic Mini-Project; Node.js)',
    'Accept': 'application/json'
  }
});

class WeatherService {
  /**
   * Search cities by name using Open-Meteo Geocoding API
   * @param {string} query - Name of city to search
   * @param {number} count - Max results (default: 5)
   */
  async searchCities(query, count = 5) {
    if (!query || query.trim().length === 0) {
      throw new Error('City name is required');
    }

    try {
      const response = await httpClient.get(`${GEOCODING_BASE_URL}/search`, {
        params: {
          name: query.trim(),
          count: count,
          language: 'en',
          format: 'json'
        },
        timeout: 10000
      });

      if (!response.data.results || response.data.results.length === 0) {
        return [];
      }

      return response.data.results.map(city => ({
        id: city.id,
        name: city.name,
        latitude: city.latitude,
        longitude: city.longitude,
        country: city.country || '',
        countryCode: city.country_code || '',
        admin1: city.admin1 || '',
        timezone: city.timezone || 'auto',
        elevation: city.elevation || 0,
        population: city.population || 0
      }));
    } catch (error) {
      console.error('Error in searchCities:', error.message);
      throw new Error(`Failed to search location: ${error.message}`);
    }
  }

  /**
   * Fetch current weather details for given coordinates
   * @param {number} latitude
   * @param {number} longitude
   */
  async getCurrentWeather(latitude, longitude) {
    try {
      const response = await httpClient.get(`${WEATHER_BASE_URL}/forecast`, {
        params: {
          latitude,
          longitude,
          current: [
            'temperature_2m',
            'relative_humidity_2m',
            'apparent_temperature',
            'is_day',
            'precipitation',
            'rain',
            'weather_code',
            'surface_pressure',
            'wind_speed_10m',
            'wind_direction_10m'
          ].join(','),
          daily: [
            'temperature_2m_max',
            'temperature_2m_min',
            'sunrise',
            'sunset',
            'uv_index_max'
          ].join(','),
          timezone: 'auto'
        },
        timeout: 10000
      });

      const current = response.data.current;
      const daily = response.data.daily;
      const condition = getWeatherCondition(current.weather_code);

      return {
        latitude: response.data.latitude,
        longitude: response.data.longitude,
        timezone: response.data.timezone,
        elevation: response.data.elevation,
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
          condition: condition.description,
          icon: condition.icon,
          category: condition.category
        },
        todaySummary: {
          tempMax: daily.temperature_2m_max[0],
          tempMin: daily.temperature_2m_min[0],
          sunrise: daily.sunrise[0],
          sunset: daily.sunset[0],
          uvIndexMax: daily.uv_index_max[0]
        }
      };
    } catch (error) {
      console.error('Error in getCurrentWeather:', error.message);
      throw new Error(`Failed to fetch current weather: ${error.message}`);
    }
  }

  /**
   * Fetch complete forecast (current + next 24h hourly + 7-day daily)
   * @param {number} latitude
   * @param {number} longitude
   */
  async getForecast(latitude, longitude) {
    try {
      const response = await httpClient.get(`${WEATHER_BASE_URL}/forecast`, {
        params: {
          latitude,
          longitude,
          current: [
            'temperature_2m',
            'relative_humidity_2m',
            'apparent_temperature',
            'is_day',
            'precipitation',
            'rain',
            'weather_code',
            'surface_pressure',
            'wind_speed_10m',
            'wind_direction_10m'
          ].join(','),
          hourly: [
            'temperature_2m',
            'relative_humidity_2m',
            'apparent_temperature',
            'precipitation_probability',
            'precipitation',
            'weather_code',
            'surface_pressure',
            'visibility',
            'wind_speed_10m'
          ].join(','),
          daily: [
            'weather_code',
            'temperature_2m_max',
            'temperature_2m_min',
            'apparent_temperature_max',
            'apparent_temperature_min',
            'sunrise',
            'sunset',
            'uv_index_max',
            'precipitation_sum',
            'rain_sum',
            'precipitation_probability_max',
            'wind_speed_10m_max'
          ].join(','),
          timezone: 'auto'
        },
        timeout: 10000
      });

      const current = response.data.current;
      const currentCondition = getWeatherCondition(current.weather_code);

      // Process 24-hour hourly forecast (next 24 hours from current time)
      const hourlyData = [];
      const currentHourIso = new Date().toISOString().slice(0, 13);
      let startIndex = response.data.hourly.time.findIndex(t => t.startsWith(currentHourIso));
      if (startIndex === -1) startIndex = 0;

      for (let i = startIndex; i < Math.min(startIndex + 24, response.data.hourly.time.length); i++) {
        const hCode = response.data.hourly.weather_code[i];
        const hCond = getWeatherCondition(hCode);
        hourlyData.push({
          time: response.data.hourly.time[i],
          temperature: response.data.hourly.temperature_2m[i],
          feelsLike: response.data.hourly.apparent_temperature[i],
          humidity: response.data.hourly.relative_humidity_2m[i],
          precipitationProbability: response.data.hourly.precipitation_probability[i],
          precipitation: response.data.hourly.precipitation[i],
          pressure: response.data.hourly.surface_pressure[i],
          visibility: response.data.hourly.visibility ? response.data.hourly.visibility[i] / 1000 : null, // in km
          windSpeed: response.data.hourly.wind_speed_10m[i],
          weatherCode: hCode,
          condition: hCond.description,
          icon: hCond.icon
        });
      }

      // Process 7-day daily forecast
      const dailyData = [];
      for (let i = 0; i < response.data.daily.time.length; i++) {
        const dCode = response.data.daily.weather_code[i];
        const dCond = getWeatherCondition(dCode);
        dailyData.push({
          date: response.data.daily.time[i],
          tempMax: response.data.daily.temperature_2m_max[i],
          tempMin: response.data.daily.temperature_2m_min[i],
          apparentTempMax: response.data.daily.apparent_temperature_max[i],
          apparentTempMin: response.data.daily.apparent_temperature_min[i],
          precipitationSum: response.data.daily.precipitation_sum[i],
          rainSum: response.data.daily.rain_sum[i],
          precipitationProbabilityMax: response.data.daily.precipitation_probability_max[i],
          windSpeedMax: response.data.daily.wind_speed_10m_max[i],
          sunrise: response.data.daily.sunrise[i],
          sunset: response.data.daily.sunset[i],
          uvIndexMax: response.data.daily.uv_index_max[i],
          weatherCode: dCode,
          condition: dCond.description,
          icon: dCond.icon,
          category: dCond.category
        });
      }

      return {
        latitude: response.data.latitude,
        longitude: response.data.longitude,
        timezone: response.data.timezone,
        elevation: response.data.elevation,
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
          condition: currentCondition.description,
          icon: currentCondition.icon,
          category: currentCondition.category
        },
        hourly: hourlyData,
        daily: dailyData
      };
    } catch (error) {
      console.error('Error in getForecast:', error.message);
      throw new Error(`Failed to fetch forecast: ${error.message}`);
    }
  }

  /**
   * Fetch historical daily weather for trend analytics
   * @param {number} latitude
   * @param {number} longitude
   * @param {string} startDate - YYYY-MM-DD
   * @param {string} endDate - YYYY-MM-DD
   */
  async getHistoricalWeather(latitude, longitude, startDate, endDate) {
    try {
      const response = await httpClient.get(`${ARCHIVE_BASE_URL}/archive`, {
        params: {
          latitude,
          longitude,
          start_date: startDate,
          end_date: endDate,
          daily: [
            'temperature_2m_max',
            'temperature_2m_min',
            'temperature_2m_mean',
            'precipitation_sum',
            'rain_sum',
            'wind_speed_10m_max'
          ].join(','),
          timezone: 'auto'
        },
        timeout: 15000
      });

      const daily = response.data.daily;
      const historyRecords = [];

      for (let i = 0; i < daily.time.length; i++) {
        historyRecords.push({
          date: daily.time[i],
          tempMean: daily.temperature_2m_mean[i],
          tempMax: daily.temperature_2m_max[i],
          tempMin: daily.temperature_2m_min[i],
          precipitation: daily.precipitation_sum[i],
          rain: daily.rain_sum[i],
          windSpeedMax: daily.wind_speed_10m_max[i]
        });
      }

      return {
        latitude: response.data.latitude,
        longitude: response.data.longitude,
        startDate,
        endDate,
        records: historyRecords
      };
    } catch (error) {
      console.error('Error in getHistoricalWeather:', error.message);
      throw new Error(`Failed to fetch historical weather: ${error.message}`);
    }
  }
}

module.exports = new WeatherService();
