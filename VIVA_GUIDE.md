# WeatherGPT – Viva & Project Defense Guide 🎓🌦️

**College Mini Project – Lovely Professional University (LPU)**  
**Course Code:** CSE276  
**Team Members:**  
1. **Rahul Choudhary** (Lead Developer)  
2. **Gurbani Kaur**  
3. **Karamjit Singh**  
4. **Tisha Makhija**  

---

## 🏛️ 1. Architecture Overview (How to Explain in 60 Seconds)
WeatherGPT follows a **decoupled 3-tier microservice architecture**:
1. **Frontend (Next.js 14 + TypeScript + Tailwind CSS)**: 
   - 6 fully reactive views: Real-time Dashboard, Gemini AI Assistant, City Comparison, 14-day Historical Analytics, Live Satellite Radar Map, and ML Model Insights.
2. **Backend API Gateway (Node.js + Express.js - Port 5000)**:
   - Aggregates external APIs (Open-Meteo geocoding & forecast).
   - Manages Gemini AI SDK (`@google/genai`) with meteorological grounding.
   - Provides JWT Authentication & Custom Weather Alerts with MongoDB Atlas + in-memory fallback.
   - Acts as gateway to the Python ML Microservice.
3. **ML Microservice (Python + FastAPI - Port 8000)**:
   - Custom machine learning models trained on 10+ years of historical weather data.
   - Serves low-latency predictions via REST endpoints (`/predict/temperature`, `/predict/rainfall`, `/models/info`).

---

## 🧠 2. The Two Types of AI (Crucial Viva Point)
Evaluators often ask: *"Did you just wrap an API or build real ML?"*
**Answer:** WeatherGPT explicitly implements **both**:

| Feature | Technology | Role / Purpose |
| :--- | :--- | :--- |
| **Generative AI** | Google Gemini (`@google/genai`) | Natural language understanding, explaining complex weather trends, conversational advice (e.g. "Should I carry an umbrella?"). Grounded with real weather values so it never hallucinates. |
| **Custom Machine Learning** | Scikit-learn, Pandas, Joblib | Independently collected historical climate data, engineered lag/rolling features, trained regression & classification models for next-day predictions. |

---

## 📊 3. Custom ML Models & Actual Evaluation Metrics

### Model A: Temperature Prediction (Regression)
- **Algorithm:** Linear Regression (Won against Random Forest on generalizability).
- **Target:** Next-day mean temperature in Celsius.
- **Evaluation Metrics:**
  - **$R^2$ Score:** `0.9750` ($97.5\%$ variance explained)
  - **MAE (Mean Absolute Error):** `1.41 °C`
  - **RMSE (Root Mean Squared Error):** `1.84 °C`
- **Key Features:** Lagged temperatures (`temp_lag_1`, `temp_lag_2`, `temp_lag_3`), 7-day rolling average (`temp_roll_7`), atmospheric pressure, humidity, seasonality features (day of year, sine/cosine transformation).

### Model B: Rainfall Prediction (Classification)
- **Algorithm:** Logistic Regression with `class_weight='balanced'`.
- **Target:** Binary classification — Rain ($\ge 0.1\text{ mm}$) vs No Rain.
- **Evaluation Metrics:**
  - **Accuracy:** `83.56%`
  - **ROC-AUC Score:** `0.8362`
  - **F1 Score:** `0.7115`
  - **Precision & Recall:** Handled using balanced class weights because rainfall is naturally imbalanced in dry seasons.

---

## 🚀 4. How to Run the Project for Live Demo
Double-click `start-all.bat` in the project root:
```bash
start-all.bat
```
This automatically boots all 3 services in separate windows and launches `http://localhost:3000` in the browser:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000/api/health`
- ML Service Docs: `http://localhost:8000/docs`
