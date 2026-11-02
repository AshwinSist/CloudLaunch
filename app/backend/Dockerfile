
FROM python:3.13-alpine

WORKDIR /app

# Update Alpine security packages
RUN apk upgrade --no-cache

# Upgrade Python packaging and vulnerable dependencies
RUN pip install --no-cache-dir --upgrade \
    pip setuptools urllib3 msgpack

# Create a dedicated non-root user
RUN adduser -D -h /home/appuser -s /sbin/nologin appuser

# Install application dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY --chown=appuser:appuser main.py .

# Run as a non-root user
USER appuser

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
