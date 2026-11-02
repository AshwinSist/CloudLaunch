
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

APP_VERSION = "1.0.1"

app = FastAPI(
    title="CloudLaunch API",
    description="Backend API for the CloudLaunch platform",
    version=APP_VERSION
)

# Allow the React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Welcome to CloudLaunch Application",
        "version": APP_VERSION
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "version": APP_VERSION
    }


@app.get("/version")
def version():
    return {
        "version": APP_VERSION
    }


@app.get("/api/dashboard")
def dashboard_data():
    return {
        "total_deployments": 0,
        "successful_deployments": 0,
        "security_issues": 0,
        "estimated_cloud_cost": 0.00,
        "aws_connected": False,
        "environment": "Development",
        "app_version": APP_VERSION
    }
