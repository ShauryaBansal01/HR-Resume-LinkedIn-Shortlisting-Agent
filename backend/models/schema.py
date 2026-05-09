from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database.db import Base

class JobDescription(Base):
    __tablename__ = "job_descriptions"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description_text = Column(Text)
    extracted_skills = Column(Text) # JSON string
    created_at = Column(DateTime, default=datetime.utcnow)
    
    candidates = relationship("Candidate", back_populates="job_description")

class Candidate(Base):
    __tablename__ = "candidates"
    id = Column(Integer, primary_key=True, index=True)
    job_description_id = Column(Integer, ForeignKey("job_descriptions.id"))
    name = Column(String, index=True)
    email = Column(String)
    phone = Column(String)
    resume_text = Column(Text)
    extracted_data = Column(Text) # JSON string of skills, exp, edu
    status = Column(String, default="Pending") # Pending, Evaluated, Rejected, Shortlisted
    
    match_score = Column(Float, nullable=True) # Overall score
    skills_score = Column(Float, nullable=True)
    experience_score = Column(Float, nullable=True)
    education_score = Column(Float, nullable=True)
    projects_score = Column(Float, nullable=True)
    communication_score = Column(Float, nullable=True)
    
    ai_reasoning = Column(Text, nullable=True)
    human_override_score = Column(Float, nullable=True)
    human_override_reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    job_description = relationship("JobDescription", back_populates="candidates")
