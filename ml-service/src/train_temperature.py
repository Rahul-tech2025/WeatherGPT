"""
WeatherGPT - Phase 7: Temperature Prediction Model Training
Trains Linear Regression vs Random Forest Regressor on chronological train/test split.
Evaluates MAE, RMSE, and R2 score on unseen future observations.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.preprocessing import StandardScaler

FEATURE_COLS = [
    'temp_mean_lag1',
    'temp_max_lag1',
    'temp_min_lag1',
    'temp_mean_lag2',
    'temp_mean_lag3',
    'humidity_lag1',
    'humidity_lag2',
    'pressure_lag1',
    'wind_speed_lag1',
    'temp_mean_roll3',
    'temp_mean_roll7',
    'sin_month',
    'cos_month',
    'sin_day_of_year',
    'cos_day_of_year'
]

TARGET_COL = 'target_temperature'

def train_temperature_models(features_csv, models_dir):
    print(f"[*] Loading features from: {features_csv}")
    df = pd.read_csv(features_csv)
    df['date'] = pd.to_datetime(df['date'])

    # Chronological Split: 2019-2023 for Training, 2024 for Testing (unseen future test)
    split_date = pd.to_datetime('2024-01-01')
    train_mask = df['date'] < split_date
    test_mask = df['date'] >= split_date

    X_train = df.loc[train_mask, FEATURE_COLS]
    y_train = df.loc[train_mask, TARGET_COL]

    X_test = df.loc[test_mask, FEATURE_COLS]
    y_test = df.loc[test_mask, TARGET_COL]

    print(f"[*] Chronological Train/Test Split:")
    print(f"    Train Period: {df.loc[train_mask, 'date'].min().date()} to {df.loc[train_mask, 'date'].max().date()} ({len(X_train)} samples)")
    print(f"    Test Period:  {df.loc[test_mask, 'date'].min().date()} to {df.loc[test_mask, 'date'].max().date()} ({len(X_test)} samples)")

    # Feature Scaling
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    results = {}

    # 1. Model A1: Linear Regression
    print("\n[*] Training Model 1: Linear Regression...")
    lr_model = LinearRegression()
    lr_model.fit(X_train_scaled, y_train)
    lr_preds = lr_model.predict(X_test_scaled)

    lr_mae = mean_absolute_error(y_test, lr_preds)
    lr_rmse = np.sqrt(mean_squared_error(y_test, lr_preds))
    lr_r2 = r2_score(y_test, lr_preds)

    print(f"    [Linear Regression Results]")
    print(f"    MAE:  {lr_mae:.3f} °C")
    print(f"    RMSE: {lr_rmse:.3f} °C")
    print(f"    R²:   {lr_r2:.4f}")

    results['LinearRegression'] = {
        'mae': round(lr_mae, 3),
        'rmse': round(lr_rmse, 3),
        'r2': round(lr_r2, 4)
    }

    # 2. Model A2: Random Forest Regressor
    print("\n[*] Training Model 2: Random Forest Regressor...")
    rf_model = RandomForestRegressor(n_estimators=100, max_depth=12, random_state=42, n_jobs=-1)
    rf_model.fit(X_train, y_train) # Tree-based models work directly on unscaled features
    rf_preds = rf_model.predict(X_test)

    rf_mae = mean_absolute_error(y_test, rf_preds)
    rf_rmse = np.sqrt(mean_squared_error(y_test, rf_preds))
    rf_r2 = r2_score(y_test, rf_preds)

    print(f"    [Random Forest Regressor Results]")
    print(f"    MAE:  {rf_mae:.3f} °C")
    print(f"    RMSE: {rf_rmse:.3f} °C")
    print(f"    R²:   {rf_r2:.4f}")

    results['RandomForestRegressor'] = {
        'mae': round(rf_mae, 3),
        'rmse': round(rf_rmse, 3),
        'r2': round(rf_r2, 4)
    }

    # Model Selection: Pick model with higher R² score (or lower MAE)
    if rf_r2 >= lr_r2:
        best_model_name = "RandomForestRegressor"
        best_model = rf_model
        best_metrics = results['RandomForestRegressor']
        use_scaler = False
    else:
        best_model_name = "LinearRegression"
        best_model = lr_model
        best_metrics = results['LinearRegression']
        use_scaler = True

    print(f"\n[🏆] Winning Model: {best_model_name} (R² = {best_metrics['r2']}, MAE = {best_metrics['mae']}°C)")

    # Save Best Model Artifacts
    os.makedirs(models_dir, exist_ok=True)
    model_artifact = {
        'model': best_model,
        'model_name': best_model_name,
        'feature_cols': FEATURE_COLS,
        'scaler': scaler if use_scaler else None,
        'use_scaler': use_scaler,
        'metrics': best_metrics,
        'all_results': results
    }

    model_path = os.path.join(models_dir, "temperature_model.joblib")
    joblib.dump(model_artifact, model_path)
    print(f"[✓] Saved model artifact to: {model_path}")

    return model_artifact

if __name__ == "__main__":
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)

    features_path = os.path.join(project_root, "data", "processed", "weather_features.csv")
    models_path = os.path.join(project_root, "models")

    train_temperature_models(features_path, models_path)
