"""
WeatherGPT - Phase 7: Rainfall Prediction Model Training
Trains Logistic Regression vs Random Forest Classifier on chronological train/test split.
Handles class imbalance and evaluates Accuracy, Precision, Recall, F1 Score & Confusion Matrix.
"""

import os
import joblib
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix
)
from sklearn.preprocessing import StandardScaler

FEATURE_COLS = [
    'temp_mean_lag1',
    'humidity_lag1',
    'humidity_lag2',
    'pressure_lag1',
    'wind_speed_lag1',
    'precipitation_lag1',
    'rain_lag1',
    'precip_sum_roll3',
    'humidity_roll3',
    'sin_month',
    'cos_month',
    'sin_day_of_year',
    'cos_day_of_year'
]

TARGET_COL = 'target_rain'

def train_rainfall_models(features_csv, models_dir):
    print(f"[*] Loading features from: {features_csv}")
    df = pd.read_csv(features_csv)
    df['date'] = pd.to_datetime(df['date'])

    # Chronological Split: 2019-2023 Train, 2024 Test
    split_date = pd.to_datetime('2024-01-01')
    train_mask = df['date'] < split_date
    test_mask = df['date'] >= split_date

    X_train = df.loc[train_mask, FEATURE_COLS]
    y_train = df.loc[train_mask, TARGET_COL]

    X_test = df.loc[test_mask, FEATURE_COLS]
    y_test = df.loc[test_mask, TARGET_COL]

    print(f"[*] Chronological Train/Test Split:")
    print(f"    Train: {len(X_train)} days (Rain: {y_train.sum()}, No Rain: {(y_train == 0).sum()})")
    print(f"    Test:  {len(X_test)} days (Rain: {y_test.sum()}, No Rain: {(y_test == 0).sum()})")

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    results = {}

    # 1. Model B1: Logistic Regression (balanced class weights)
    print("\n[*] Training Model 1: Logistic Regression...")
    log_reg = LogisticRegression(class_weight='balanced', max_iter=1000, random_state=42)
    log_reg.fit(X_train_scaled, y_train)
    lr_preds = log_reg.predict(X_test_scaled)
    lr_probs = log_reg.predict_proba(X_test_scaled)[:, 1]

    lr_acc = accuracy_score(y_test, lr_preds)
    lr_prec = precision_score(y_test, lr_preds, zero_division=0)
    lr_rec = recall_score(y_test, lr_preds, zero_division=0)
    lr_f1 = f1_score(y_test, lr_preds, zero_division=0)
    lr_auc = roc_auc_score(y_test, lr_probs)
    lr_cm = confusion_matrix(y_test, lr_preds).tolist()

    print(f"    [Logistic Regression Results]")
    print(f"    Accuracy:  {lr_acc*100:.2f}%")
    print(f"    Precision: {lr_prec*100:.2f}%")
    print(f"    Recall:    {lr_rec*100:.2f}%")
    print(f"    F1 Score:  {lr_f1:.4f}")
    print(f"    ROC AUC:   {lr_auc:.4f}")
    print(f"    Confusion Matrix: {lr_cm}")

    results['LogisticRegression'] = {
        'accuracy': round(lr_acc, 4),
        'precision': round(lr_prec, 4),
        'recall': round(lr_rec, 4),
        'f1': round(lr_f1, 4),
        'roc_auc': round(lr_auc, 4),
        'confusion_matrix': lr_cm
    }

    # 2. Model B2: Random Forest Classifier (balanced class weights)
    print("\n[*] Training Model 2: Random Forest Classifier...")
    rf_clf = RandomForestClassifier(n_estimators=100, max_depth=10, class_weight='balanced', random_state=42, n_jobs=-1)
    rf_clf.fit(X_train, y_train)
    rf_preds = rf_clf.predict(X_test)
    rf_probs = rf_clf.predict_proba(X_test)[:, 1]

    rf_acc = accuracy_score(y_test, rf_preds)
    rf_prec = precision_score(y_test, rf_preds, zero_division=0)
    rf_rec = recall_score(y_test, rf_preds, zero_division=0)
    rf_f1 = f1_score(y_test, rf_preds, zero_division=0)
    rf_auc = roc_auc_score(y_test, rf_probs)
    rf_cm = confusion_matrix(y_test, rf_preds).tolist()

    print(f"    [Random Forest Classifier Results]")
    print(f"    Accuracy:  {rf_acc*100:.2f}%")
    print(f"    Precision: {rf_prec*100:.2f}%")
    print(f"    Recall:    {rf_rec*100:.2f}%")
    print(f"    F1 Score:  {rf_f1:.4f}")
    print(f"    ROC AUC:   {rf_auc:.4f}")
    print(f"    Confusion Matrix: {rf_cm}")

    results['RandomForestClassifier'] = {
        'accuracy': round(rf_acc, 4),
        'precision': round(rf_prec, 4),
        'recall': round(rf_rec, 4),
        'f1': round(rf_f1, 4),
        'roc_auc': round(rf_auc, 4),
        'confusion_matrix': rf_cm
    }

    # Model Selection: Pick model with higher F1 score on test set
    if rf_f1 >= lr_f1:
        best_model_name = "RandomForestClassifier"
        best_model = rf_clf
        best_metrics = results['RandomForestClassifier']
        use_scaler = False
    else:
        best_model_name = "LogisticRegression"
        best_model = log_reg
        best_metrics = results['LogisticRegression']
        use_scaler = True

    print(f"\n[🏆] Winning Model: {best_model_name} (F1 Score = {best_metrics['f1']}, Accuracy = {best_metrics['accuracy']*100:.1f}%)")

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

    model_path = os.path.join(models_dir, "rainfall_model.joblib")
    joblib.dump(model_artifact, model_path)
    print(f"[✓] Saved model artifact to: {model_path}")

    return model_artifact

if __name__ == "__main__":
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)

    features_path = os.path.join(project_root, "data", "processed", "weather_features.csv")
    models_path = os.path.join(project_root, "models")

    train_rainfall_models(features_path, models_path)
