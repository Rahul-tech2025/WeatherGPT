@echo off
title WeatherGPT - Master Launcher
color 0b

echo ========================================================
echo       WEATHERGPT - MASTER LAUNCHER (LPU MINI PROJECT)
echo ========================================================
echo [1/3] Starting Python ML FastAPI Microservice (Port 8000)...
start "WeatherGPT - ML Service (8000)" cmd /k "cd ml-service && python main.py"

timeout /t 3 /nobreak > nul

echo [2/3] Starting Express.js Backend API (Port 5000)...
start "WeatherGPT - Backend (5000)" cmd /k "cd backend && npm start"

timeout /t 3 /nobreak > nul

echo [3/3] Starting Next.js Frontend Dashboard (Port 3000)...
start "WeatherGPT - Frontend (3000)" cmd /k "cd frontend && npm run dev"

timeout /t 5 /nobreak > nul

echo ========================================================
echo All services launched! Opening WeatherGPT in browser...
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000/api/health
echo ML API:   http://localhost:8000/health
echo ========================================================
start http://localhost:3000
