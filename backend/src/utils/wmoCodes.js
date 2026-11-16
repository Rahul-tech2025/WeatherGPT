/**
 * WMO Weather interpretation codes (WW)
 * https://open-meteo.com/en/docs
 */
const WMO_CODE_MAP = {
  0: { description: 'Clear sky', icon: 'clear-day', category: 'Clear' },
  1: { description: 'Mainly clear', icon: 'partly-cloudy-day', category: 'Clear' },
  2: { description: 'Partly cloudy', icon: 'partly-cloudy-day', category: 'Cloudy' },
  3: { description: 'Overcast', icon: 'cloudy', category: 'Cloudy' },
  45: { description: 'Foggy', icon: 'fog', category: 'Fog' },
  48: { description: 'Depositing rime fog', icon: 'fog', category: 'Fog' },
  51: { description: 'Light drizzle', icon: 'drizzle', category: 'Drizzle' },
  53: { description: 'Moderate drizzle', icon: 'drizzle', category: 'Drizzle' },
  55: { description: 'Dense drizzle', icon: 'drizzle', category: 'Drizzle' },
  56: { description: 'Light freezing drizzle', icon: 'drizzle-snow', category: 'Freezing' },
  57: { description: 'Dense freezing drizzle', icon: 'drizzle-snow', category: 'Freezing' },
  61: { description: 'Slight rain', icon: 'rain-light', category: 'Rain' },
  63: { description: 'Moderate rain', icon: 'rain-moderate', category: 'Rain' },
  65: { description: 'Heavy rain', icon: 'rain-heavy', category: 'Rain' },
  66: { description: 'Light freezing rain', icon: 'freezing-rain', category: 'Freezing' },
  67: { description: 'Heavy freezing rain', icon: 'freezing-rain', category: 'Freezing' },
  71: { description: 'Slight snow fall', icon: 'snow', category: 'Snow' },
  73: { description: 'Moderate snow fall', icon: 'snow', category: 'Snow' },
  75: { description: 'Heavy snow fall', icon: 'snow-heavy', category: 'Snow' },
  77: { description: 'Snow grains', icon: 'snow', category: 'Snow' },
  80: { description: 'Slight rain showers', icon: 'showers', category: 'Rain' },
  81: { description: 'Moderate rain showers', icon: 'showers', category: 'Rain' },
  82: { description: 'Violent rain showers', icon: 'showers-heavy', category: 'Rain' },
  85: { description: 'Slight snow showers', icon: 'snow-showers', category: 'Snow' },
  86: { description: 'Heavy snow showers', icon: 'snow-showers', category: 'Snow' },
  95: { description: 'Thunderstorm', icon: 'thunderstorm', category: 'Thunderstorm' },
  96: { description: 'Thunderstorm with slight hail', icon: 'thunderstorm-hail', category: 'Thunderstorm' },
  99: { description: 'Thunderstorm with heavy hail', icon: 'thunderstorm-hail', category: 'Thunderstorm' }
};

function getWeatherCondition(code) {
  return WMO_CODE_MAP[code] || {
    description: 'Unknown weather condition',
    icon: 'cloudy',
    category: 'Cloudy'
  };
}

module.exports = {
  WMO_CODE_MAP,
  getWeatherCondition
};
