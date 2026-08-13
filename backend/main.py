"""ResumeIQ FastAPI application entrypoint."""

import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from database import init_db  # noqa: E402
from routes import analysis, resume  # noqa: E402

app = FastAPI(title="ResumeIQ API", version="1.0.0")

origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:8080,http://localhost:5173,http://localhost:3000",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in origins if o.strip()],
    allow_origin_regex=r"https?://.*\.lovable\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume.router)
app.include_router(analysis.router)


@app.on_event("startup")
def on_startup() -> None:
    init_db()


@app.get("/api/health")
def health():
    return {"status": "ok", "gemini_configured": bool(os.getenv("GEMINI_API_KEY"))}
