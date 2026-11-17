# LOVELY PROFESSIONAL UNIVERSITY (LPU), PUNJAB
### Department of Computer Science & Engineering
---
# PROJECT REPORT / SYNOPSIS
## “WeatherGPT”
### “Conversational AI for Weather Forecasting, Alerts, and Climate Information”

**Submitted in partial fulfillment of the requirements for the degree of:**  
**B.Tech (Computer Science & Engineering – Artificial Intelligence & Machine Learning)**

---

### Submitted By:
1. **Rahul Choudhary** (Reg. No. 12504340) – Project Lead & Main Developer  
2. **Gurbani Kaur** (Reg. No. 12505953)  
3. **Karamjit Singh** (Reg. No. 12513056)  
4. **Tisha Makhija** (Reg. No. 12509332)  

### Under the Guidance of:
**Mr. Alan Alexander (UID: 35108)**  
Assistant Professor, Department of Computer Science & Engineering  
Lovely Professional University, Punjab  

---

## 1. Title of the Project
**WeatherGPT: Conversational AI for Weather Forecasting, Alerts, and Climate Information**

---

## 2. Abstract
Weather information heavily influences agricultural planning, aviation, road travel, and personal decision-making. Conventional weather portals typically present information as cluttered, numeric dashboards that everyday users find cumbersome to interpret. Conversely, general-purpose Large Language Models (LLMs) can generate natural language responses but frequently suffer from factual hallucination and lack real-time meteorological synchronization.

To solve this dichotomy, **WeatherGPT** proposes a comprehensive weather intelligence platform engineered with a decoupled 3-tier microservice architecture that unites **two distinct paradigms of Artificial Intelligence**:
1. **Pre-trained Generative AI (Google Gemini):** Utilized strictly for natural language query understanding, entity extraction, and conversational explanation—fully grounded in verified meteorological telemetry so that hallucinations are eliminated.
2. **Custom Trained Machine Learning Models (Scikit-Learn):** Independently trained on 6 years of historical daily meteorological observations for Jalandhar, Punjab (2019–2024; 2,184 samples). A chronological train-test split (2019–2023 for training, 2024 for testing) was implemented to prevent temporal data leakage. 
   - **Temperature Regressor (Linear Regression):** Achieved an exceptional $R^2$ Score of **0.9750**, Mean Absolute Error (MAE) of **$1.048^\circ\text{C}$**, and Root Mean Squared Error (RMSE) of **$1.309^\circ\text{C}$** on unseen test data.
   - **Rainfall Classifier (Logistic Regression with Balanced Weights):** Addressed severe seasonal class imbalance to achieve **83.56% Accuracy**, **0.7115 F1-Score**, and an **ROC-AUC of 0.8362** across 365 test days.

The system is deployed via a Next.js 14 frontend, an Express.js API gateway, and a Python FastAPI ML microservice, featuring real-time radar mapping, multi-city comparison, customizable weather alerts, and historical climate analytics.

**Keywords:** Conversational AI, Machine Learning, Meteorological Forecasting, Linear Regression, Logistic Regression, Retrieval Grounding, Google Gemini, FastAPI, Next.js.

---

## 3. Introduction

### 3.1 Background
Accurate weather forecasting is critical across diverse socioeconomic domains. With the advent of modern open meteorological APIs (such as Open-Meteo) and advances in machine learning, high-resolution atmospheric telemetry has become freely accessible. However, raw data tables remain unintuitive for the general public, creating an urgent need for intelligent conversational interfaces backed by robust predictive models.

### 3.2 Motivation
When users check weather forecasts, they rarely seek raw pressure in hectopascals or humidity percentages; they ask pragmatic questions: *"Will it rain tomorrow afternoon?"*, *"Should I carry an umbrella to campus?"*, or *"How does today's heat index compare to last week?"*. While Large Language Models can answer conversational prompts, they lack live atmospheric grounding. Meanwhile, existing apps lack predictive machine learning customized to regional historical patterns.

### 3.3 Project Vision & The Two AI Paradigms
WeatherGPT bridges this gap by decoupling Generative AI from Custom Machine Learning:
- **Generative AI (Gemini):** Explains live weather telemetry and machine learning inferences conversationally.
- **Custom Machine Learning (Scikit-Learn Microservice):** Employs mathematical regression and classification algorithms trained on multi-year localized historical climate datasets to generate empirical next-day predictions.

---

## 4. Problem Statement
Existing weather information systems exhibit several major limitations:
1. **Cognitive Overload:** Complex meteorological variables (dew point, surface pressure, atmospheric visibility) are displayed without actionable natural-language context.
2. **LLM Hallucination Risk:** Standard AI chatbots attempt to predict or describe weather without real-time API connectivity, generating confident yet factually incorrect values.
3. **Absence of Independent ML Verification:** Commercial applications rely on proprietary black-box forecasts without giving users transparent model evaluation metrics, confidence scores, or feature importance.
4. **Poor Multi-City Comparative Workflows:** Comparing climatic indices across geographic regions requires cumbersome multi-tab navigation.

---

## 5. Aim and Objectives

### 5.1 Aim
To design, train, and deploy an end-to-end intelligent weather platform that couples grounded conversational AI with custom-trained machine learning algorithms for regional temperature regression and precipitation classification.

### 5.2 Objectives
1. **Historical Data Pipeline:** Collect, clean, and engineer features from 6 years of daily historical climate records (2019–2024) from the Open-Meteo Historical Archive.
2. **Predictive Model Development:** 
   - Train and compare regression models (Linear Regression vs. Random Forest) for next-day mean temperature prediction.
   - Train and compare classification models (Logistic Regression vs. Random Forest Classifier) for next-day rainfall occurrence ($\ge 0.1\text{ mm}$), rigorously addressing seasonal class imbalance.
3. **Microservice Engineering:** Encapsulate trained model artifacts (`.joblib`) within a Python FastAPI microservice exposing RESTful `/predict` and `/metrics` endpoints.
4. **API Gateway & Grounded AI:** Implement a Node.js Express gateway that integrates live Open-Meteo telemetry, queries the Python ML microservice, and prompts Google Gemini using strict context-grounded retrieval.
5. **Interactive Responsive Interface:** Build a Next.js 14 dashboard providing real-time conditions, 24-hour carousels, 7-day outlooks, side-by-side city comparisons, historical trend charts, and an interactive satellite radar map.

---

## 6. Literature Review

| Author & Year | Research Approach | Key Findings | Limitations in Practice |
| :--- | :--- | :--- | :--- |
| **Lewis et al., 2020** | Retrieval-Augmented Generation (RAG) | Coupling generative models with external factual data reduces factual hallucinations. | Primarily developed for static text corpora; requires adaptation for dynamic meteorological streaming data. |
| **Ji et al., 2023** | Survey of Hallucination in NLG | Identifies causes of hallucination in autoregressive language models and advocates strict grounding. | Theoretical overview without real-time predictive engineering. |
| **Bi et al., 2023 (Pangu-Weather)** | 3D Deep Neural Networks for Global Forecasting | Deep learning achieves competitive accuracy over numerical weather prediction (NWP) models. | Extremely compute-intensive (requires TPU/GPU supercomputers); produces tensor fields rather than accessible user insights. |
| **Google Gemini Team, 2023** | Multimodal Foundational Language Models | Demonstrates superior contextual reasoning, code generation, and conversational articulation. | Requires explicit JSON schema injection and system instructions to prevent speculative forecasting. |

---

## 7. System Architecture
WeatherGPT uses a decoupled 3-tier microservice architecture:

```
                          ┌───────────────────────────────────────┐
                          │   Next.js 14 Frontend UI (Port 3000)   │
                          │ TypeScript, Tailwind CSS, Recharts,   │
                          │         Interactive Leaflet Map       │
                          └──────────────────┬────────────────────┘
                                             │ HTTP REST / JSON
                                             ▼
                          ┌───────────────────────────────────────┐
                          │ Express.js Backend Gateway (Port 5000)│
                          │ - Open-Meteo REST Client              │
                          │ - Gemini AI Grounding Engine          │
                          │ - JWT Auth & Alert Dispatcher         │
                          └───────┬───────────────────────┬───────┘
                                  │                       │
               Internal HTTP REST │                       │ External Cloud
                                  ▼                       ▼
    ┌───────────────────────────────────┐    ┌───────────────────────────┐
    │ Python FastAPI ML Service (8000)  │    │ 1. Open-Meteo Global API  │
    │ - Linear Regression Model (.joblib)│   │ 2. Google Gemini API      │
    │ - Logistic Regression (.joblib)   │    │ 3. MongoDB Atlas (Cloud)  │
    │ - Evaluation Metrics & Features   │    │ 4. RainViewer Radar API   │
    └───────────────────────────────────┘    └───────────────────────────┘
```

---

## 8. Machine Learning Pipeline & Methodology

### 8.1 Dataset Description
Historical atmospheric data was collected for **Jalandhar, Punjab (Latitude: 31.3256° N, Longitude: 75.5792° E)** covering **January 1, 2019 to December 31, 2024** (2,184 daily records).

The raw dataset incorporates:
- Daily Mean Temperature ($^\circ\text{C}$), Max Temperature ($^\circ\text{C}$), Min Temperature ($^\circ\text{C}$)
- Relative Humidity (%)
- Surface Air Pressure (hPa)
- Wind Speed at 10m (km/h)
- Daily Precipitation Sum (mm) & Rain Sum (mm)

### 8.2 Chronological Train/Test Split (Zero Data Leakage)
Because meteorological data is inherently temporal, randomized k-fold shuffling introduces future-to-past data leakage. We enforced a strict chronological split:
- **Training Set:** 2019-01-01 to 2023-12-31 (**1,819 days / 83.3%**)
- **Test Set:** 2024-01-01 to 2024-12-31 (**365 days / 16.7%** – completely unseen by the model during training)

### 8.3 Feature Engineering
To capture atmospheric momentum and cyclical climate patterns, we engineered 15 high-signal features:
1. **Autoregressive Lag Features:**
   - Temperature lags: $T_{t-1}, T_{t-2}, T_{t-3}$
   - Maximum & Minimum lags: $T_{\max, t-1}, T_{\min, t-1}$
   - Humidity & Pressure lags: $H_{t-1}, H_{t-2}, P_{t-1}$
   - Precipitation & Wind lags: $\text{Precip}_{t-1}, W_{t-1}$
2. **Rolling Statistics:**
   - 3-day and 7-day rolling mean temperature: $\bar{T}_{3\text{d}}, \bar{T}_{7\text{d}}$
   - 3-day precipitation summation: $\sum \text{Precip}_{3\text{d}}$
3. **Cyclical Temporal Encoding:**
   To capture seasonal continuity across calendar transitions (e.g. Dec 31 to Jan 1):
   $$\sin\left(\frac{2\pi \cdot \text{day}}{365}\right), \quad \cos\left(\frac{2\pi \cdot \text{day}}{365}\right)$$
   $$\sin\left(\frac{2\pi \cdot \text{month}}{12}\right), \quad \cos\left(\frac{2\pi \cdot \text{month}}{12}\right)$$

---

## 9. Machine Learning Evaluation & Results (Official Validation)

### 9.1 Model A: Temperature Prediction (Regression)
- **Target:** Predict next-day mean temperature ($T_{t+1}$) in Celsius.
- **Formulas:**
  $$\text{MAE} = \frac{1}{n} \sum_{i=1}^n |y_i - \hat{y}_i|, \quad \text{RMSE} = \sqrt{\frac{1}{n} \sum_{i=1}^n (y_i - \hat{y}_i)^2}, \quad R^2 = 1 - \frac{\sum (y_i - \hat{y}_i)^2}{\sum (y_i - \bar{y})^2}$$

#### Regression Model Comparison Table (Test Set 2024 – 365 Unseen Days)

| Model Algorithm | MAE ($^\circ\text{C}$) | RMSE ($^\circ\text{C}$) | $R^2$ Score | Selection Status |
| :--- | :--- | :--- | :--- | :--- |
| **Linear Regression (Ridge/OLS)** | **1.0480** | **1.3090** | **0.9750** | **Selected (Winning Model)** |
| **Random Forest Regressor** | 1.3100 | 1.6690 | 0.9593 | Baseline Comparison |

> **Scientific Analysis:** Linear Regression demonstrated superior generalizability with an $R^2$ of **0.9750**, indicating that **97.5% of variance in daily temperatures** is accurately captured by atmospheric momentum and cyclical features, yielding an average error of only **$1.04^\circ\text{C}$**.

---

### 9.2 Model B: Rainfall Occurrence Prediction (Classification)
- **Target:** Binary indicator of rain occurrence ($R_{t+1} \ge 0.1\text{ mm} \implies 1$, else $0$).
- **Handling Class Imbalance:** Rainfall in Northern India is highly seasonal (concentrated in monsoon months), causing severe class imbalance (~71% dry days vs. 29% rainy days in test data). We configured `class_weight='balanced'` in the loss optimization.

#### Classification Model Comparison Table (Test Set 2024 – 365 Days)

| Model Algorithm | Accuracy | Precision | Recall | F1-Score | ROC-AUC | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Logistic Regression (Balanced)** | **83.56%** | **72.55%** | **69.81%** | **0.7115** | **0.8362** | **Selected** |
| **Random Forest Classifier** | 80.82% | 68.00% | 64.15% | 0.6602 | 0.7937 | Comparison |

#### Detailed Confusion Matrix (Logistic Regression – 365 Days Unseen Test Data)

| Actual \ Predicted | Predicted: No Rain (0) | Predicted: Rain (1) | Total Actual |
| :--- | :--- | :--- | :--- |
| **Actual: No Rain (0)** | **231 (True Negatives)** | **28 (False Positives)** | **259 Days** |
| **Actual: Rain (1)** | **32 (False Negatives)** | **74 (True Positives)** | **106 Days** |
| **Total Predicted** | **263 Days** | **102 Days** | **365 Days** |

#### In-Depth Metric Breakdown:
- **True Negative Rate (Specificity):** $\frac{231}{259} = \mathbf{89.19\%}$ (Reliably filters out false rain alarms).
- **True Positive Rate (Sensitivity / Recall):** $\frac{74}{106} = \mathbf{69.81\%}$ (Successfully captures ~70% of all precipitation events in unseen data).
- **Precision:** $\frac{74}{74 + 28} = \mathbf{72.55\%}$ (When model alerts rain, it is correct in ~3 out of 4 instances).
- **ROC-AUC Score:** **0.8362**, proving strong discriminative capability across all decision thresholds.

---

## 10. Implemented Modules and Working Verification

The WeatherGPT system is fully functional across 6 integrated modules:

1. **Interactive Real-Time Dashboard:** Displays current telemetry (temperature, feels-like, humidity, wind, pressure, visibility, sunrise/sunset), a 24-hour horizontal forecast carousel, and a 7-day outlook.
2. **Custom ML Intelligence Card:** Features real-time next-day temperature inferences ($^\circ\text{C}$), rain probabilities, and displays actual model performance metrics ($R^2=0.975$, Accuracy=$83.56\%$).
3. **Conversational AI Assistant (Gemini):** Answers user inquiries (e.g. *"Will it rain tomorrow?"*) through grounded prompt injection, citing official forecast vs. custom ML prediction sources.
4. **Multi-City Comparison Matrix:** Side-by-side comparative analysis of up to 3 cities simultaneously (comparing heat indices, wind speeds, and rain likelihoods).
5. **Historical Climate Analytics:** 7, 14, and 30-day interactive time-series charts visualizing past temperature envelopes and rainfall accumulations.
6. **Live Interactive Satellite Radar Map:** Leaflet map integrated with live RainViewer satellite radar precipitation overlays with click-to-telemetry geocoding.

---

## 11. Conclusion & Future Work
WeatherGPT demonstrates that combining **Grounded Generative AI** with **custom-trained Scikit-Learn models** delivers a vastly superior user experience compared to traditional numerical weather applications. By independently curating regional datasets, engineering lag and cyclical temporal features, and evaluating regression and classification metrics on completely unseen test data, the project satisfies both software engineering standards and AI/ML rigor.

**Future Scope:**
- Expanding training datasets across multi-regional climate zones across India.
- Implementing SMS / WhatsApp automated alert delivery via Twilio or Web Push Notifications.
- Developing native mobile applications using React Native.

---

## 12. References
1. Open-Meteo, "Historical Weather API & Geocoding Documentation," 2024. [Online]. Available: https://open-meteo.com
2. Google DeepMind, "Gemini: A Family of Highly Capable Multimodal Models," arXiv:2312.11805, 2023.
3. Pedregosa et al., "Scikit-learn: Machine Learning in Python," Journal of Machine Learning Research, vol. 12, pp. 2825–2830, 2011.
4. Lewis et al., "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks," in NeurIPS, vol. 33, 2020.
5. Bi, K. et al., "Accurate medium-range global weather forecasting with 3D neural networks," Nature, vol. 619, pp. 533–538, 2023.
