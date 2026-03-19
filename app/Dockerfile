FROM python:3.10-slim-bookworm

WORKDIR /app
ENV PIP_DISABLE_PIP_VERSION_CHECK=1
ENV PIP_PROGRESS_BAR=off
ENV PIP_DEFAULT_TIMEOUT=240
ENV PIP_RETRIES=20
ENV PIP_INDEX_URL=https://pypi.org/simple
ENV PIP_TRUSTED_HOST="pypi.org files.pythonhosted.org pypi.python.org"

# Install Python deps in a separate cached layer.
COPY requirements.txt /app/requirements.txt
RUN pip install -v --no-cache-dir --prefer-binary -r /app/requirements.txt

RUN apt-get update -o Acquire::Retries=5 -o Acquire::http::Timeout=30 \
    && apt-get install -y --no-install-recommends chromium curl \
    && rm -rf /var/lib/apt/lists/*

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80", "--reload"]
