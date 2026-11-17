"""
WeatherGPT ML Service - FastAPI Application
Provides prediction APIs for temperature regression, rainfall classification,
and evaluation metrics.
"""

import os
import json
from datetime import datetime
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from src.predict import (
    are_models_loaded,
    predict_temperature,
    predict_rainfall,
    extract_features_from_history,
    METRICS_PATH
)

app = FastAPI(
    title="WeatherGPT ML Service",
    description="Machine Learning Prediction Service for WeatherGPT (Temperature Regression & Rainfall Classification)",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- Pydantic Schemas -----------------

class DayWeatherObservation(BaseModel):
    date: Optional[str] = None
    temp_mean: float = Field(..., description="Daily mean temperature in °C")
    temp_max: float = Field(..., description="Daily max temperature in °C")
    temp_min: float = Field(..., description="Daily min temperature in °C")
    humidity: float = Field(..., description="Mean relative humidity in %")
    pressure: float = Field(..., description="Mean surface pressure in hPa")
    wind_speed: float = Field(..., description="Max wind speed in km/h")
    precipitation: float = Field(0.0, description="Total daily precipitation in mm")

class HistoryPredictRequest(BaseModel):
    city: Optional[str] = "Unknown"
    target_date: Optional[str] = None
    history: List[DayWeatherObservation] = Field(
        ...,
        description="At least 3-7 consecutive days of daily weather leading up to today"
    )

class DirectTemperatureRequest(BaseModel):
    features: Dict[str, float]

class DirectRainfallRequest(BaseModel):
    features: Dict[str, float]

# ----------------- Endpoints -----------------

@app.get("/health")
def health_check():
    models = are_models_loaded()
    all_ready = all(models.values())
    return {
        "status": "healthy" if all_ready else "degraded",
        "service": "WeatherGPT ML Engine",
        "timestamp": datetime.utcnow().isoformat(),
        "models_loaded": models
    }

@app.get("/model/metrics")
def get_metrics():
    """Returns genuine evaluation metrics and model comparison records."""
    if not os.path.exists(METRICS_PATH):
        raise HTTPException(status_code=404, detail="Metrics file not found. Run evaluation first.")
    with open(METRICS_PATH, "r", encoding="utf-8") as f:
        metrics = json.load(f)
    return metrics

@app.post("/predict/temperature")
def api_predict_temperature(req: DirectTemperatureRequest):
    """Predicts next-day mean temperature using direct feature dictionary."""
    try:
        result = predict_temperature(req.features)
        return {
            "status": "success",
            "prediction": result
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/predict/rainfall")
def api_predict_rainfall(req: DirectRainfallRequest):
    """Predicts next-day rainfall occurrence using direct feature dictionary."""
    try:
        result = predict_rainfall(req.features)
        return {
            "status": "success",
            "prediction": result
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/predict/daily")
def api_predict_daily(req: HistoryPredictRequest):
    """
    End-to-end endpoint: Computes all required lag/rolling features from recent
    daily weather history (past 3-7 days) and generates both next-day temperature
    and rainfall predictions.
    """
    if len(req.history) < 3:
        raise HTTPException(
            status_code=400,
            detail="At least 3 past daily observations are required to calculate lag features."
        )

    try:
        # Convert Pydantic models to dicts
        history_dicts = [obs.model_dump() for obs in req.history]

        target_dt = None
        if req.target_date:
            try:
                target_dt = datetime.fromisoformat(req.target_date)
            except ValueError:
                target_dt = None

        features = extract_features_from_history(history_dicts, target_dt)

        temp_pred = predict_temperature(features)
        rain_pred = predict_rainfall(features)

        return {
            "status": "success",
            "city": req.city,
            "target_date": req.target_date or datetime.utcnow().strftime("%Y-%m-%d"),
            "temperature_prediction": temp_pred,
            "rainfall_prediction": rain_pred,
            "computed_features": features
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
