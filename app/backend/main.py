
import os

import boto3
from botocore.config import Config
from botocore.exceptions import BotoCoreError, ClientError
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

APP_VERSION = "1.0.1"

AWS_REGION = (
    os.getenv("AWS_REGION")
    or os.getenv("AWS_DEFAULT_REGION")
    or "ap-southeast-2"
)

app = FastAPI(
    title="CloudLaunch API",
    description="Backend API for the CloudLaunch platform",
    version=APP_VERSION
)

# Allow the React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://13.211.100.244"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_ec2_dashboard_data():
    """Retrieve real EC2 instance information using the attached IAM role."""

    try:
        ec2 = boto3.client(
            "ec2",
            region_name=AWS_REGION,
            config=Config(
                connect_timeout=2,
                read_timeout=5,
                retries={"max_attempts": 1}
            )
        )

        paginator = ec2.get_paginator("describe_instances")

        total_instances = 0
        running_instances = 0
        stopped_instances = 0

        for page in paginator.paginate():
            for reservation in page.get("Reservations", []):
                for instance in reservation.get("Instances", []):
                    total_instances += 1

                    state = instance.get("State", {}).get("Name")

                    if state == "running":
                        running_instances += 1
                    elif state == "stopped":
                        stopped_instances += 1

        return {
            "aws_connected": True,
            "aws_region": AWS_REGION,
            "total_ec2_instances": total_instances,
            "running_ec2_instances": running_instances,
            "stopped_ec2_instances": stopped_instances,
            "aws_error": None
        }

    except (BotoCoreError, ClientError):
        return {
            "aws_connected": False,
            "aws_region": AWS_REGION,
            "total_ec2_instances": None,
            "running_ec2_instances": None,
            "stopped_ec2_instances": None,
            "aws_error": "Unable to retrieve EC2 information. Check IAM permissions and AWS connectivity."
        }


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
    ec2_data = get_ec2_dashboard_data()

    return {
        # Deployment and security metrics are not integrated yet.
        "total_deployments": None,
        "successful_deployments": None,
        "security_issues": None,
        "estimated_cloud_cost": None,

        # Live AWS EC2 information
        **ec2_data,

        "environment": os.getenv("APP_ENVIRONMENT", "Production"),
        "app_version": APP_VERSION
    }
