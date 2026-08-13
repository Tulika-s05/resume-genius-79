"""Resume analysis and job-match endpoints."""

import json
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlalchemy.orm import Session

from database import get_db
from models import Analysis
from schemas import AnalysisResponse, JobMatchRequest, JobMatchResult
from services.gemini_service import analyze_resume, match_job
from services.resume_parser import extract_text

router = APIRouter(prefix="/api/resume", tags=["resume"])


@router.post("/analyze", response_model=AnalysisResponse)
async def analyze(
    file: UploadFile = File(...),
    target_role: Optional[str] = Form(None),
    db: Session = Depends(get_db),
):
    content = await file.read()
    resume_text = extract_text(file.filename, content)

    role = (target_role or "").strip() or None
    result = analyze_resume(resume_text, role)

    record = Analysis(
        filename=file.filename,
        target_role=role,
        resume_text=resume_text,
        analysis=json.dumps(result.model_dump()),
        overall_score=result.overall_score,
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return AnalysisResponse(
        id=record.id,
        filename=record.filename,
        target_role=record.target_role,
        resume_text=record.resume_text,
        created_at=record.created_at,
        analysis=result,
    )


@router.post("/job-match", response_model=JobMatchResult)
def job_match(payload: JobMatchRequest):
    return match_job(payload.resume_text, payload.job_description)
