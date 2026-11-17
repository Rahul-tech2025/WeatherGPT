"""
WeatherGPT - ML Inference Service
Loads trained model artifacts and performs temperature regression & rainfall classification.
Supports both direct feature dicts and automatic feature engineering from 7-day weather history.
"""

import os
import joblib
import numpy as np
import pandas as pd
from datetime import datetime
from typing import Dict, Any, List, Optional

# Load models on module import
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "models")

TEMP_MODEL_PATH = os.path.join(MODELS_DIR, "temperature_model.joblib")
RAIN_MODEL_PATH = os.path.join(MODELS_DIR, "rainfall_model.joblib")
METRICS_PATH = os.path.join(MODELS_DIR, "metrics.json")

temp_artifact = None
rain_artifact = None

def load_artifacts():
    global temp_artifact, rain_artifact
    if os.path.exists(TEMP_MODEL_PATH):
        temp_artifact = joblib.load(TEMP_MODEL_PATH)
        print(f"[✓] Loaded temperature model: {temp_artifact['model_name']}")
    else:
        print(f"[!] Warning: Temperature model not found at {TEMP_MODEL_PATH}")

    if os.path.exists(RAIN_MODEL_PATH):
        rain_artifact = joblib.load(RAIN_MODEL_PATH)
        print(f"[✓] Loaded rainfall model: {rain_artifact['model_name']}")
    else:
        print(f"[!] Warning: Rainfall model not found at {RAIN_MODEL_PATH}")

# Initialize models
load_artifacts()

def are_models_loaded() -> Dict[str, bool]:
    return {
        "temperature_model": temp_artifact is not None,
        "rainfall_model": rain_artifact is not None
    }

def compute_cyclical_features(target_date: Optional[datetime] = None) -> Dict[str, float]:
    """Computes cyclical sine and cosine calendar features for a given date."""
    if target_date is None:
        target_date = datetime.now()

    month = target_date.month
    day_of_year = target_date.timetuple().tm_yday
    days_in_year = 366 if (target_date.year % 4 == 0 and (target_date.year % 100 != 0 or target_date.year % 400 == 0)) else 365

    return {
        "sin_month": float(np.sin(2 * np.pi * month / 12)),
        "cos_month": float(np.cos(2 * np.pi * month / 12)),
        "sin_day_of_year": float(np.sin(2 * np.pi * day_of_year / days_in_year)),
        "cos_day_of_year": float(np.cos(2 * np.pi * day_of_year / days_in_year))
    }

def extract_features_from_history(history: List[Dict[str, Any]], target_date: Optional[datetime] = None) -> Dict[str, float]:
    """
    Given a list of at least 7 past daily observations sorted chronologically:
    [
      { "date": "...", "temp_mean": 24.5, "temp_max": 30.1, "temp_min": 19.2,
        "humidity": 65.0, "pressure": 1012.0, "wind_speed": 12.5, "precipitation": 0.0 },
      ...
    ]
    Computes all lag and rolling features required by both models.
    """
    if len(history) < 3:
        raise ValueError(f"At least 3 recent daily observations required, got {len(history)}.")

    # Sort history by date ascending if dates provided
    df = pd.DataFrame(history)
    if 'date' in df.columns:
        df['date'] = pd.to_datetime(df['date'])
        df = df.sort_values('date').reset_index(drop=True)

    n = len(df)
    # Lags (1, 2, 3 days ago relative to prediction target)
    lag1 = df.iloc[-1]
    lag2 = df.iloc[-2] if n >= 2 else lag1
    lag3 = df.iloc[-3] if n >= 3 else lag2

    # Rolling statistics
    roll3_df = df.iloc[-3:]
    roll7_df = df.iloc[-7:] if n >= 7 else df

    temp_mean_roll3 = float(roll3_df['temp_mean'].mean())
    temp_mean_roll7 = float(roll7_df['temp_mean'].mean())
    precip_sum_roll3 = float(roll3_df['precipitation'].sum()) if 'precipitation' in roll3_df.columns else 0.0
    humidity_roll3 = float(roll3_df['humidity'].mean())

    calendar = compute_cyclical_features(target_date)

    precip_lag1 = float(lag1.get('precipitation', 0.0))
    rain_lag1 = 1 if precip_lag1 > 0.1 else 0

    features = {
        # Temperature features
        "temp_mean_lag1": float(lag1['temp_mean']),
        "temp_max_lag1": float(lag1['temp_max']),
        "temp_min_lag1": float(lag1['temp_min']),
        "temp_mean_lag2": float(lag2['temp_mean']),
        "temp_mean_lag3": float(lag3['temp_mean']),
        "humidity_lag1": float(lag1['humidity']),
        "humidity_lag2": float(lag2['humidity']),
        "pressure_lag1": float(lag1['pressure']),
        "wind_speed_lag1": float(lag1['wind_speed']),
        "temp_mean_roll3": temp_mean_roll3,
        "temp_mean_roll7": temp_mean_roll7,

        # Rainfall features
        "precipitation_lag1": precip_lag1,
        "rain_lag1": rain_lag1,
        "precip_sum_roll3": precip_sum_roll3,
        "humidity_roll3": humidity_roll3,

        # Shared cyclical features
        **calendar
    }

    return features

def predict_temperature(features_dict: Dict[str, float]) -> Dict[str, Any]:
    """Inference for Next-Day Mean Temperature in °C"""
    if temp_artifact is None:
        raise RuntimeError("Temperature model is not loaded.")

    model = temp_artifact['model']
    scaler = temp_artifact['scaler']
    feature_cols = temp_artifact['feature_cols']

    # Verify missing features
    missing = [c for c in feature_cols if c not in features_dict]
    if missing:
        raise ValueError(f"Missing required temperature features: {missing}")

    # Build feature DataFrame to maintain feature names for StandardScaler
    X_df = pd.DataFrame([{c: features_dict[c] for c in feature_cols}])
    if scaler is not None:
        X = scaler.transform(X_df)
    else:
        X = X_df.values

    predicted_temp = float(model.predict(X)[0])
    mae = temp_artifact['metrics'].get('mae', 1.05)

    return {
        "predicted_temp_celsius": round(predicted_temp, 2),
        "predicted_temp_fahrenheit": round((predicted_temp * 9/5) + 32, 2),
        "confidence_range_celsius": {
            "min": round(predicted_temp - mae, 2),
            "max": round(predicted_temp + mae, 2)
        },
        "model_name": temp_artifact['model_name'],
        "metrics": temp_artifact['metrics']
    }

def predict_rainfall(features_dict: Dict[str, float]) -> Dict[str, Any]:
    """Inference for Next-Day Rainfall Occurrence (> 0.1 mm)"""
    if rain_artifact is None:
        raise RuntimeError("Rainfall model is not loaded.")

    model = rain_artifact['model']
    scaler = rain_artifact['scaler']
    feature_cols = rain_artifact['feature_cols']

    missing = [c for c in feature_cols if c not in features_dict]
    if missing:
        raise ValueError(f"Missing required rainfall features: {missing}")

    X_df = pd.DataFrame([{c: features_dict[c] for c in feature_cols}])
    if scaler is not None:
        X = scaler.transform(X_df)
    else:
        X = X_df.values

    prob = float(model.predict_proba(X)[0, 1])
    is_rain = bool(prob >= 0.5)

    return {
        "will_rain": is_rain,
        "rain_probability": round(prob, 4),
        "rain_probability_pct": round(prob * 100, 1),
        "confidence": "high" if (prob >= 0.75 or prob <= 0.25) else "moderate",
        "threshold_mm": 0.1,
        "model_name": rain_artifact['model_name'],
        "metrics": rain_artifact['metrics']
    }
