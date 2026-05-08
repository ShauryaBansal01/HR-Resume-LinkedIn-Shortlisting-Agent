from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class CandidateBase(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    status: str = "Pending"

class CandidateCreate(CandidateBase):
    job_description_id: int
    resume_text: str

class CandidateResponse(CandidateBase):
    id: int
    job_description_id: int
    match_score: Optional[float] = None
    skills_score: Optional[float] = None
    experience_score: Optional[float] = None
    education_score: Optional[float] = None
    projects_score: Optional[float] = None
    communication_score: Optional[float] = None
    ai_reasoning: Optional[str] = None
    human_override_score: Optional[float] = None
    human_override_reason: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class JobDescriptionBase(BaseModel):
    title: str

class JobDescriptionCreate(JobDescriptionBase):
    description_text: str

class JobDescriptionResponse(JobDescriptionBase):
    id: int
    extracted_skills: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
