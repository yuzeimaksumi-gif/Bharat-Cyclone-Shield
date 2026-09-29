"""Bharat Cyclone Shield - FastAPI backend (Phase 1: health check only)."""
import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()  # reads backend/.env if it exists

app = FastAPI(title="Bharat Cyclone Shield API", version="0.1.0")

# Allow the Vite dev server to call this API from the browser
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:5173").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "project": "Bharat Cyclone Shield",
        "team": "MATRIX",
        "mode": os.getenv("APP_MODE", "DEMO"),
    }