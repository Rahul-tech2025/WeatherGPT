"""
WeatherGPT - Phase 7: ML Evaluation Summary Generator
Extracts and consolidates genuine evaluation metrics into models/metrics.json
"""

import os
import json
import joblib

def generate_metrics_summary(models_dir, output_json):
    temp_model_path = os.path.join(models_dir, "temperature_model.joblib")
    rain_model_path = os.path.join(models_dir, "rainfall_model.joblib")

    if not os.path.exists(temp_model_path) or not os.path.exists(rain_model_path):
        raise FileNotFoundError("Trained model files not found. Train temperature and rainfall models first.")

    temp_art = joblib.load(temp_model_path)
    rain_art = joblib.load(rain_model_path)

    summary = {
        "status": "success",
        "dataset": {
            "city": "Jalandhar, Punjab",
            "period": "2019-01-01 to 2024-12-31",
            "train_period": "2019 to 2023",
            "test_period": "2024 (100% unseen test observations)",
            "total_samples": 2184
        },
        "temperature_prediction": {
            "target": "Next-Day Mean Temperature (°C)",
            "selected_model": temp_art["model_name"],
            "features_used": temp_art["feature_cols"],
            "best_metrics": temp_art["metrics"],
            "algorithm_comparison": temp_art["all_results"]
        },
        "rainfall_prediction": {
            "target": "Next-Day Rainfall Occurrence (> 0.1 mm)",
            "selected_model": rain_art["model_name"],
            "features_used": rain_art["feature_cols"],
            "best_metrics": rain_art["metrics"],
            "algorithm_comparison": rain_art["all_results"]
        }
    }

    with open(output_json, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)

    print(f"[✓] Evaluation summary successfully written to: {output_json}")
    return summary

if __name__ == "__main__":
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)

    models_path = os.path.join(project_root, "models")
    metrics_json_path = os.path.join(models_path, "metrics.json")

    generate_metrics_summary(models_path, metrics_json_path)
