"""SQLAlchemy models."""

from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String, Text

from database import Base


class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    target_role = Column(String(255), nullable=True)
    resume_text = Column(Text, nullable=False)
    analysis = Column(Text, nullable=False)  # JSON string
    overall_score = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
