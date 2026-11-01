
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="CloudLaunch Food Ordering API",
    description="Backend API for the CloudLaunch platform",
    version="1.0.0"
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
        "message": "Welcome to CloudLaunch Food Ordering Application"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


@app.get("/version")
def version():
    return {
        "version": "1.0.0"
    }


@app.get("/api/dashboard")
def dashboard_data():
    return {
        "total_deployments": 0,
        "successful_deployments": 0,
        "security_issues": 0,
        "estimated_cloud_cost": 0.00,
        "aws_connected": False,
        "environment": "Development"
    }
