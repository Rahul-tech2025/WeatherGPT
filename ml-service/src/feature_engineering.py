"""
WeatherGPT - Phase 6: Feature Engineering Pipeline
Creates cyclical temporal features, multi-day lag variables, and rolling statistics
for Next-Day Temperature Regression and Rainfall Classification.
"""

import os
import numpy as np
import pandas as pd

def create_features(input_csv, output_csv):
    print(f"[*] Loading cleaned dataset from: {input_csv}")
    df = pd.read_csv(input_csv)
    df['date'] = pd.to_datetime(df['date'])
    df = df.sort_values('date').reset_index(drop=True)

    print(f"[*] Base records: {len(df)}")

    # 1. Cyclical Calendar Features
    df['month'] = df['date'].dt.month
    df['day_of_year'] = df['date'].dt.dayofyear
    df['day_of_week'] = df['date'].dt.dayofweek

    df['sin_month'] = np.sin(2 * np.pi * df['month'] / 12)
    df['cos_month'] = np.cos(2 * np.pi * df['month'] / 12)
    df['sin_day_of_year'] = np.sin(2 * np.pi * df['day_of_year'] / 365.25)
    df['cos_day_of_year'] = np.cos(2 * np.pi * df['day_of_year'] / 365.25)

    # 2. Lag Features (Historical Past Observations - strictly avoiding data leakage)
    df['temp_mean_lag1'] = df['temp_mean'].shift(1)
    df['temp_max_lag1'] = df['temp_max'].shift(1)
    df['temp_min_lag1'] = df['temp_min'].shift(1)
    df['temp_mean_lag2'] = df['temp_mean'].shift(2)
    df['temp_mean_lag3'] = df['temp_mean'].shift(3)

    df['humidity_lag1'] = df['humidity_mean'].shift(1)
    df['humidity_lag2'] = df['humidity_mean'].shift(2)

    df['pressure_lag1'] = df['pressure_mean'].shift(1)
    df['wind_speed_lag1'] = df['wind_speed_max'].shift(1)
    df['precipitation_lag1'] = df['precipitation_sum'].shift(1)
    df['rain_lag1'] = df['rain_sum'].shift(1)

    # 3. Rolling Window Statistics
    df['temp_mean_roll3'] = df['temp_mean'].shift(1).rolling(window=3).mean()
    df['temp_mean_roll7'] = df['temp_mean'].shift(1).rolling(window=7).mean()
    df['humidity_roll3'] = df['humidity_mean'].shift(1).rolling(window=3).mean()
    df['precip_sum_roll3'] = df['precipitation_sum'].shift(1).rolling(window=3).sum()

    # 4. Supervised Learning Targets (Next-Day Predictions)
    # Target A: Next day average temperature in Celsius (Regression)
    df['target_temperature'] = df['temp_mean'].shift(-1)

    # Target B: Next day rainfall occurrence (Classification: 1 if rain > 0.1 mm else 0)
    df['target_rain'] = (df['precipitation_sum'].shift(-1) > 0.1).astype(int)

    # Target C (Optional Extension): Next day rainfall amount in mm (Regression)
    df['target_rain_amount'] = df['precipitation_sum'].shift(-1)

    # 5. Clean NaN values created by lag (7 days at start) and target shift (1 day at end)
    features_df = df.dropna().reset_index(drop=True)

    print(f"[*] Engineered dataset shape: {features_df.shape}")
    print(f"[*] Rainfall Class Distribution (target_rain):")
    rain_counts = features_df['target_rain'].value_counts()
    print(f"    No Rain (0): {rain_counts.get(0, 0)} days ({rain_counts.get(0, 0)/len(features_df)*100:.1f}%)")
    print(f"    Rain (1):    {rain_counts.get(1, 0)} days ({rain_counts.get(1, 0)/len(features_df)*100:.1f}%)")

    os.makedirs(os.path.dirname(output_csv), exist_ok=True)
    features_df.to_csv(output_csv, index=False)
    print(f"[✓] Feature engineered dataset saved to: {output_csv}")
    return features_df

if __name__ == "__main__":
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)

    cleaned_path = os.path.join(project_root, "data", "processed", "historical_weather_cleaned.csv")
    features_path = os.path.join(project_root, "data", "processed", "weather_features.csv")

    create_features(cleaned_path, features_path)
