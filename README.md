# WeatherGPT | Aerospace Weather Intelligence & Machine Learning

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Express.js](https://img.shields.io/badge/Express-5.0-lightgrey?style=flat-square&logo=express)](https://expressjs.com/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.4-F7931E?style=flat-square&logo=scikit-learn)](https://scikit-learn.org/)
[![Google Gemini](https://img.shields.io/badge/Google-Gemini_AI-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)
[![Security Hardened](https://img.shields.io/badge/Security-CSP_%2B_HSTS_%2B_RateLimiting-success?style=flat-square)](#-security--protection-suite)

> An enterprise-grade meteorological intelligence platform combining real-time global telemetry, dual-model **Scikit-Learn** predictive machine learning, and conversational grounding via **Google Gemini**.

Developed as an Academic Capstone Project for **CSE276** at **Lovely Professional University (LPU)**.

---

## 👥 Engineering Team & Authorship
- **Rahul Choudhary (Reg: 12504340)** — *Project Lead & System Architect*
- **Gurbani Kaur** — *Data Pipeline & Analytics*
- **Karamjit Singh** — *Backend & Model Integration*
- **Tisha Makhija** — *Validation & Academic Documentation*

---

## 🏛️ System Architecture

WeatherGPT operates on a decoupled 3-tier microservice architecture:

```
                          ┌─────────────────────────────────────┐
                          │     Next.js 14 Web Frontend         │
                          │   (Deep Space Monochromatic UI)     │
                          └──────────────────┬──────────────────┘
                                             │ HTTPS / REST (Port 3000)
                                             ▼
                          ┌─────────────────────────────────────┐
                          │      Express.js Gateway Service     │
                          │    (Rate Limiting & Security)       │
                          └──────┬───────────────────────┬──────┘
                                 │                       │
                Open-Meteo &     │                       │ Internal REST
                Gemini AI API    ▼                       ▼ (Port 8000)
                    ┌──────────────────┐   ┌───────────────────────────┐
                    │ External Telemetry│   │    Python FastAPI ML      │
                    │ & Google Gemini   │   │ (Scikit-Learn Regressors  │
                    │ Conversational AI │   │  & Climate Classifiers)   │
                    └──────────────────┘   └───────────────────────────┘
```

---

## 🧠 Machine Learning Engine Architecture

Trained on 5 years of daily meteorological archives (2019–2024, Jalandhar/Punjab region) with chronological 2024 holdout validation:

| Model Task | Winning Algorithm | Benchmark Competitor | Key Validation Metric | Performance |
| :--- | :--- | :--- | :--- | :--- |
| **Next-Day Mean Temp** | **Linear Regression** | Random Forest Regressor | **$R^2$ / MAE** | **$R^2 = 0.9750$, MAE = 1.048°C** |
| **Next-Day Rainfall** | **Logistic Regression (Balanced)** | Random Forest Classifier | **Accuracy / ROC-AUC** | **83.56% Accuracy, ROC-AUC = 0.8362** |

### Why Linear Regression Outperformed Random Forest:
- Atmospheric temperature sequences follow continuous thermodynamic and solar radiant functions rather than step-function decision tree boundaries.
- Linear regression avoided the tree variance and boundary clipping seen in Random Forest, generalizing with higher fidelity on 2024 unseen data.

---

## 🛡️ Security & Protection Suite

- **Content Security Policy (CSP):** Strict script, style, and object source restrictions preventing XSS injection attacks.
- **Clickjacking Prevention:** `X-Frame-Options: DENY` and `frame-ancestors 'none'`.
- **Sliding-Window IP Rate Limiter:** Protects Express endpoints against brute-force and Denial-of-Service (DoS) floods.
- **Deep Injection Sanitization:** Recursive parameter parsing stripping MongoDB/NoSQL operators (`$gt`, `$where`) and prototype pollution vectors.
- **Strict Payload Caps:** Max `50kb` JSON payloads preventing memory exhaustion attacks.
- **HSTS Enforcement:** Strict HTTPS enforcement with `max-age=63072000; includeSubDomains`.

---

## 🎨 Frontend Design Highlights

- **Deep Space Monochromatic Aesthetic:** Crisp starlight palette, custom SVG glyphs, and zero distracting emojis.
- **Apple-Grade Dynamic Island Capsule:** Fluid liquid morphing with `cubic-bezier(0.32, 0.72, 0, 1)`, absolute cross-fade layers, and auto click-outside dismiss.
- **Hardware-Antialiased 3D Tilt Cards:** Perspective tracking with specular glare and subpixel antialiasing (`outline: 1px solid transparent`).
- **Interactive Atmospheric Time Machine:** 24-hour horizontal scrubber with instant hourly preview.
- **Rolling Digital Tickers:** Mechanical flip-board style number transitions for temperature and metrics.

---

## ⚡ Quickstart & Local Execution

### 1-Click Launch (Windows):
Double-click `start-all.bat` in the repository root to launch all 3 microservices simultaneously.

### Manual Launch:
```bash
# 1. Start Python ML Microservice (Port 8000)
cd ml-service
python main.py

# 2. Start Express API Gateway (Port 5000)
cd ../backend
npm start

# 3. Start Next.js Frontend (Port 3000)
cd ../frontend
npm run dev
```

Visit **`http://localhost:3000`** in your browser.

---

## 📄 Academic Deliverables & Documentation
- **[FINAL_PROJECT_REPORT.html](./FINAL_PROJECT_REPORT.html):** Comprehensive printable capstone project report with formulas, confusion matrices, and academic citations.
- **[VIVA_GUIDE.md](./VIVA_GUIDE.md):** Complete viva examination Q&A guide with expected faculty questions and defense arguments.
- **[NOTICE.md](./NOTICE.md):** Project notice, course attribution (CSE276), and student registration details.

---

© 2026 WeatherGPT. All rights reserved.  
Project Lead: **Rahul Choudhary (12504340)** | Lovely Professional University (LPU).
