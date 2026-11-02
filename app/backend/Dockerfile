
FROM python:3.13-slim

WORKDIR /app

# Create a dedicated non-root user
RUN useradd --create-home --shell /usr/sbin/nologin appuser

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY --chown=appuser:appuser main.py .

# Run the application as a non-root user
USER appuser

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
