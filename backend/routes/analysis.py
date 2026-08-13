"""History endpoints backed by SQLite."""

import json
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Analysis
from schemas import AnalysisResponse, AnalysisResult, HistoryItem

router = APIRouter(prefix="/api/history", tags=["history"])


@router.get("", response_model=List[HistoryItem])
def list_history(db: Session = Depends(get_db)):
    rows = db.query(Analysis).order_by(Analysis.created_at.desc()).all()
    return [
        HistoryItem(
            id=r.id,
            filename=r.filename,
            target_role=r.target_role,
            overall_score=r.overall_score,
            created_at=r.created_at,
        )
        for r in rows
    ]


@router.get("/{item_id}", response_model=AnalysisResponse)
def get_history_item(item_id: int, db: Session = Depends(get_db)):
    row = db.query(Analysis).filter(Analysis.id == item_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Analysis not found.")
    return AnalysisResponse(
        id=row.id,
        filename=row.filename,
        target_role=row.target_role,
        resume_text=row.resume_text,
        created_at=row.created_at,
        analysis=AnalysisResult(**json.loads(row.analysis)),
    )


@router.delete("/{item_id}")
def delete_history_item(item_id: int, db: Session = Depends(get_db)):
    row = db.query(Analysis).filter(Analysis.id == item_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Analysis not found.")
    db.delete(row)
    db.commit()
    return {"ok": True, "id": item_id}
