"""Gemini integration: turns resume text into structured JSON."""

import json
import os
import re
from typing import Optional

import google.generativeai as genai
from fastapi import HTTPException
from pydantic import ValidationError

from schemas import AnalysisResult, JobMatchResult

MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-3.6-flash")

ANALYSIS_SCHEMA = """{
  "overall_score": 0-100,
  "ats_score": 0-100,
  "keyword_score": 0-100,
  "skills_score": 0-100,
  "formatting_score": 0-100,
  "summary": "3-4 sentence summary of the candidate",
  "matched_skills": ["skill", ...],
  "missing_skills": ["skill", ...],
  "strengths": ["3-5 strengths"],
  "improvements": ["3-5 actionable improvements"],
  "project_feedback": [{"title": "project or role name", "feedback": "1-2 sentences"}]
}"""

JOB_MATCH_SCHEMA = """{
  "match_score": 0-100,
  "matching_skills": ["skill", ...],
  "missing_keywords": ["keyword", ...],
  "recommended_changes": ["actionable change", ...]
}"""


def _model():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="GEMINI_API_KEY is not configured on the server.",
        )
    genai.configure(api_key=api_key)
    return genai.GenerativeModel(
        MODEL_NAME,
        generation_config={"response_mime_type": "application/json", "temperature": 0.3},
    )


def _generate(prompt: str) -> dict:
    try:
        response = _model().generate_content(prompt)
        raw = (response.text or "").strip()
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Gemini request failed: {exc}") from exc

    match = re.search(r"\{.*\}", raw, re.DOTALL)
    if not match:
        raise HTTPException(status_code=502, detail="Gemini did not return valid JSON.")
    try:
        return json.loads(match.group(0))
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=502, detail="Gemini returned malformed JSON.") from exc


def analyze_resume(resume_text: str, target_role: Optional[str]) -> AnalysisResult:
    role_line = (
        f'The candidate is targeting this role: "{target_role}". Judge relevance against it.'
        if target_role
        else "No target role was provided. Analyze the resume generally."
    )
    prompt = f"""You are a strict but fair ATS system and senior technical recruiter.
Analyze the resume below on ATS compatibility, relevant keywords, technical skills,
structure and formatting, projects, experience, strengths and weaknesses.

{role_line}

Return ONLY valid JSON, no markdown, matching exactly this schema:
{ANALYSIS_SCHEMA}

Rules:
- All scores are integers 0-100 and must be consistent with each other.
- matched_skills: skills clearly evidenced in the resume (max 12).
- missing_skills: relevant skills that are absent but expected (max 8).
- strengths and improvements: 3-5 items each, specific and actionable.
- project_feedback: one entry per detected project or role (max 4); empty list if none.

RESUME:
\"\"\"
{resume_text[:20000]}
\"\"\"
"""
    data = _generate(prompt)
    try:
        return AnalysisResult(**data)
    except ValidationError as exc:
        raise HTTPException(
            status_code=502, detail=f"Gemini response did not match the schema: {exc}"
        ) from exc


def match_job(resume_text: str, job_description: str) -> JobMatchResult:
    prompt = f"""You are an ATS engine comparing a resume against a job description.

Return ONLY valid JSON, no markdown, matching exactly this schema:
{JOB_MATCH_SCHEMA}

Rules:
- match_score is an integer 0-100.
- matching_skills: resume skills that the job asks for (max 12).
- missing_keywords: important job keywords absent from the resume (max 10).
- recommended_changes: 3-5 concrete resume edits to improve the match.

RESUME:
\"\"\"
{resume_text[:15000]}
\"\"\"

JOB DESCRIPTION:
\"\"\"
{job_description[:8000]}
\"\"\"
"""
    data = _generate(prompt)
    try:
        return JobMatchResult(**data)
    except ValidationError as exc:
        raise HTTPException(
            status_code=502, detail=f"Gemini response did not match the schema: {exc}"
        ) from exc
