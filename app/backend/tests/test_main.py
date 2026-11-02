
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_home_endpoint():
    response = client.get("/")

    assert response.status_code == 200
    assert response.json()["message"] == "Welcome to CloudLaunch Application"


def test_health_endpoint():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_version_endpoint():
    response = client.get("/version")

    assert response.status_code == 200
    assert response.json()["version"] == "1.0.1"


def test_dashboard_endpoint():
    response = client.get("/api/dashboard")

    assert response.status_code == 200

    data = response.json()

    assert "total_deployments" in data
    assert "aws_connected" in data
    assert data["app_version"] == "1.0.1"
