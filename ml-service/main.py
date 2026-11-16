from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

app = FastAPI(
    title="WeatherGPT ML Service",
    description="Machine Learning Prediction Service for WeatherGPT (Temperature Regression & Rainfall Classification)",
    version="1.0.0"
)

# Enable CORS for internal communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "WeatherGPT ML Engine",
        "timestamp": datetime.utcnow().isoformat(),
        "models_loaded": {
            "temperature_regressor": False,
            "rainfall_classifier": False
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
