"""
WeatherGPT - Phase 6: Preprocessing Pipeline
Cleans and validates historical meteorological dataset.
"""

import os
import pandas as pd
import numpy as np

def clean_dataset(input_csv, output_csv):
    print(f"[*] Loading raw dataset from: {input_csv}")
    df = pd.read_csv(input_csv)

    print(f"[*] Initial shape: {df.shape}")
    print("[*] Checking for missing values:")
    missing = df.isnull().sum()
    print(missing[missing > 0] if missing.sum() > 0 else "    No missing values found!")

    # Sort strictly by date chronologically
    df['date'] = pd.to_datetime(df['date'])
    df = df.sort_values('date').reset_index(drop=True)

    # Remove any potential duplicate dates
    duplicates = df.duplicated(subset=['date']).sum()
    if duplicates > 0:
        print(f"[*] Removing {duplicates} duplicate date rows...")
        df = df.drop_duplicates(subset=['date']).reset_index(drop=True)

    # Handle minor missing values if any via forward fill then backward fill
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    df[numeric_cols] = df[numeric_cols].ffill().bfill()

    # Validate reasonable physical meteorological limits
    # Humidity: 0 - 100%
    df['humidity_mean'] = df['humidity_mean'].clip(0, 100)
    # Precipitation: non-negative
    df['precipitation_sum'] = df['precipitation_sum'].clip(lower=0)
    df['rain_sum'] = df['rain_sum'].clip(lower=0)
    # Wind speed: non-negative
    df['wind_speed_max'] = df['wind_speed_max'].clip(lower=0)

    os.makedirs(os.path.dirname(output_csv), exist_ok=True)
    df.to_csv(output_csv, index=False)
    print(f"[✓] Cleaned dataset saved to: {output_csv}")
    print(f"    Total clean rows: {len(df)}")
    return df

if __name__ == "__main__":
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)

    raw_path = os.path.join(project_root, "data", "raw", "historical_weather_raw.csv")
    cleaned_path = os.path.join(project_root, "data", "processed", "historical_weather_cleaned.csv")

    clean_dataset(raw_path, cleaned_path)
