"""
WeatherGPT - Phase 5: Historical Weather Data Collection (Batched by Year)
Fetches authentic meteorological observations from Open-Meteo Historical Archive API.
"""

import os
import csv
import time
import requests

LATITUDE = 31.3256
LONGITUDE = 75.5792
CITY_NAME = "Jalandhar"
START_YEAR = 2019
END_YEAR = 2024

ARCHIVE_API_URL = "https://archive-api.open-meteo.com/v1/archive"

DAILY_VARIABLES = [
    "temperature_2m_max",
    "temperature_2m_min",
    "temperature_2m_mean",
    "apparent_temperature_mean",
    "relative_humidity_2m_mean",
    "precipitation_sum",
    "rain_sum",
    "surface_pressure_mean",
    "wind_speed_10m_max",
    "wind_direction_10m_dominant"
]

def fetch_year_data(year, lat=LATITUDE, lon=LONGITUDE):
    start_date = f"{year}-01-01"
    end_date = f"{year}-12-31"
    print(f"[*] Fetching historical weather for {CITY_NAME} ({year}) ... ", end="", flush=True)

    params = {
        "latitude": lat,
        "longitude": lon,
        "start_date": start_date,
        "end_date": end_date,
        "daily": ",".join(DAILY_VARIABLES),
        "timezone": "Asia/Kolkata"
    }

    # Retry up to 3 times
    for attempt in range(1, 4):
        try:
            response = requests.get(ARCHIVE_API_URL, params=params, timeout=45)
            response.raise_for_status()
            data = response.json()
            daily = data.get("daily", {})
            dates = daily.get("time", [])
            print(f"[✓] {len(dates)} days fetched.")
            return daily
        except requests.exceptions.RequestException as e:
            print(f"\n[-] Attempt {attempt} failed: {e}")
            if attempt < 3:
                time.sleep(2)
            else:
                raise

def collect_all_years(start_year=START_YEAR, end_year=END_YEAR):
    all_rows = []

    for year in range(start_year, end_year + 1):
        daily = fetch_year_data(year)
        dates = daily.get("time", [])

        for i in range(len(dates)):
            row = {
                "date": dates[i],
                "city": CITY_NAME,
                "latitude": LATITUDE,
                "longitude": LONGITUDE,
                "temp_max": daily.get("temperature_2m_max", [None])[i],
                "temp_min": daily.get("temperature_2m_min", [None])[i],
                "temp_mean": daily.get("temperature_2m_mean", [None])[i],
                "apparent_temp_mean": daily.get("apparent_temperature_mean", [None])[i],
                "humidity_mean": daily.get("relative_humidity_2m_mean", [None])[i],
                "precipitation_sum": daily.get("precipitation_sum", [None])[i],
                "rain_sum": daily.get("rain_sum", [None])[i],
                "pressure_mean": daily.get("surface_pressure_mean", [None])[i],
                "wind_speed_max": daily.get("wind_speed_10m_max", [None])[i],
                "wind_direction_dominant": daily.get("wind_direction_10m_dominant", [None])[i]
            }
            all_rows.append(row)

        time.sleep(0.5) # Gentle rate-limit pause

    return all_rows

def save_to_csv(rows, output_path):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    fieldnames = [
        "date",
        "city",
        "latitude",
        "longitude",
        "temp_max",
        "temp_min",
        "temp_mean",
        "apparent_temp_mean",
        "humidity_mean",
        "precipitation_sum",
        "rain_sum",
        "pressure_mean",
        "wind_speed_max",
        "wind_direction_dominant"
    ]

    with open(output_path, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"\n[🎉] Complete dataset successfully saved!")
    print(f"     Path: {output_path}")
    print(f"     Total daily observations: {len(rows)}")

if __name__ == "__main__":
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    raw_output_csv = os.path.join(project_root, "data", "raw", "historical_weather_raw.csv")

    rows = collect_all_years(START_YEAR, END_YEAR)
    save_to_csv(rows, raw_output_csv)
