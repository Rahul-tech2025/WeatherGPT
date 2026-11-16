# WeatherGPT 🌦️🤖

**Conversational AI for Weather Forecasting, Alerts, and Climate Information**

A modern AI-powered weather intelligence platform built as a College Mini Project at **Lovely Professional University (LPU)**.

---

## 👥 Project Team
- **Rahul Choudhary** – Project Lead & Main Developer
- **Gurbani Kaur** – Team Member
- **Karamjit Singh** – Team Member
- **Tisha Makhija** – Team Member

---

## 🏛️ System Architecture
WeatherGPT uses a decoupled 3-tier microservice architecture:

```
                  ┌────────────────────────┐
                  │ Next.js Frontend (UI)  │
                  └───────────┬────────────┘
                              │ HTTP / REST
                              ▼
                  ┌────────────────────────┐
                  │  Express.js Backend    │
                  └─────┬────────────┬─────┘
                        │            │
         Open-Meteo API │            │ Internal REST
         Gemini API     ▼            ▼
                  ┌─────────┐   ┌────────────────────────┐
                  │ APIs /  │   │ Python FastAPI Service │
                  │ MongoDB │   │ (Custom ML Models)     │
                  └─────────┘   └────────────────────────┘
```

1. **Frontend (`/frontend`)**: Next.js, TypeScript, Tailwind CSS, Recharts, Leaflet.
2. **Backend (`/backend`)**: Node.js, Express.js, MongoDB Atlas (Mongoose), JWT, Open-Meteo & Gemini Integration.
3. **ML Service (`/ml-service`)**: Python, Scikit-learn, Pandas, FastAPI (Temperature regression & Rainfall classification).

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (3.11+)
- Git

---

## 📜 License
Academic Mini-Project - Lovely Professional University (LPU).
