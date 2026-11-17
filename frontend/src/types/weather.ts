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


export interface MLPredictionData {
  status: string;
  city: string;
  target_date: string;
  temperature_prediction: {
    predicted_temp_celsius: number;
    predicted_temp_fahrenheit: number;
    confidence_range_celsius: {
      min: number;
      max: number;
    };
    model_name: string;
    metrics: {
      mae: number;
      rmse: number;
      r2: number;
    };
  };
  rainfall_prediction: {
    will_rain: boolean;
    rain_probability: number;
    rain_probability_pct: number;
    confidence: 'high' | 'moderate' | 'low';
    threshold_mm: number;
    model_name: string;
    metrics: {
      accuracy: number;
      precision: number;
      recall: number;
      f1: number;
      roc_auc: number;
      confusion_matrix: number[][];
    };
  };
}

export interface MLMetricsSummary {
  status: string;
  dataset: {
    city: string;
    period: string;
    train_period: string;
    test_period: string;
    total_samples: number;
  };
  temperature_prediction: {
    target: string;
    selected_model: string;
    features_used: string[];
    best_metrics: {
      mae: number;
      rmse: number;
      r2: number;
    };
    algorithm_comparison: Record<string, { mae: number; rmse: number; r2: number }>;
  };
  rainfall_prediction: {
    target: string;
    selected_model: string;
    features_used: string[];
    best_metrics: {
      accuracy: number;
      precision: number;
      recall: number;
      f1: number;
      roc_auc: number;
      confusion_matrix: number[][];
    };
    algorithm_comparison: Record<string, { accuracy: number; precision: number; recall: number; f1: number; roc_auc: number; confusion_matrix: number[][] }>;
  };
}
