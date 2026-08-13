"""Pydantic schemas for the ResumeIQ API and the Gemini response contract."""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class ProjectFeedback(BaseModel):
    title: str
    feedback: str


class AnalysisResult(BaseModel):
    """Structure Gemini must return (and that we return to the frontend)."""

    overall_score: int = Field(ge=0, le=100)
    ats_score: int = Field(ge=0, le=100)
    keyword_score: int = Field(ge=0, le=100)
    skills_score: int = Field(ge=0, le=100)
    formatting_score: int = Field(ge=0, le=100)
    summary: str
    matched_skills: List[str] = []
    missing_skills: List[str] = []
    strengths: List[str] = []
    improvements: List[str] = []
    project_feedback: List[ProjectFeedback] = []


class AnalysisResponse(BaseModel):
    id: int
    filename: str
    target_role: Optional[str] = None
    resume_text: str
    created_at: datetime
    analysis: AnalysisResult


class HistoryItem(BaseModel):
    id: int
    filename: str
    target_role: Optional[str] = None
    overall_score: int
    created_at: datetime


class JobMatchRequest(BaseModel):
    resume_text: str = Field(min_length=20)
    job_description: str = Field(min_length=20)
    analysis_id: Optional[int] = None


class JobMatchResult(BaseModel):
    match_score: int = Field(ge=0, le=100)
    matching_skills: List[str] = []
    missing_keywords: List[str] = []
    recommended_changes: List[str] = []
