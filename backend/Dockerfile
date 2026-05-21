
FROM python:3.11-slim


WORKDIR /app


RUN pip install --no-cache-dir fastapi uvicorn requests google-genai pydantic


COPY . .


EXPOSE 8000


CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "0000"]