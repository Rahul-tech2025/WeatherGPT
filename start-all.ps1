Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "    WEATHERGPT - MASTER LAUNCHER (LPU MINI PROJECT)    " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

# 1. Start Python ML Microservice
Write-Host "[1/3] Starting Python ML FastAPI Microservice (Port 8000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\ml-service'; python main.py"

Start-Sleep -Seconds 3

# 2. Start Express.js Backend API
Write-Host "[2/3] Starting Express.js Backend API (Port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\backend'; npm start"

Start-Sleep -Seconds 3

# 3. Start Next.js Frontend Dashboard
Write-Host "[3/3] Starting Next.js Frontend Dashboard (Port 3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\frontend'; npm run dev"

Start-Sleep -Seconds 5

Write-Host "========================================================" -ForegroundColor Green
Write-Host "All 3 services running successfully!" -ForegroundColor Green
Write-Host "Opening WeatherGPT: http://localhost:3000" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green

Start-Process "http://localhost:3000"
