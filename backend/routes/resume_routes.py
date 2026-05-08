from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from backend.database.db import get_db
from backend.models.schema import Candidate, JobDescription
from backend.models.schemas_pydantic import CandidateResponse
from backend.utils.file_parser import parse_file
from typing import List

router = APIRouter(prefix="/api/resume", tags=["Resume"])

@router.post("/upload", response_model=List[CandidateResponse])
async def upload_resumes(
    job_description_id: int = Form(...),
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload multiple resumes (PDF/DOCX) for a specific Job Description.
    """
    # Verify JD exists
    jd = db.query(JobDescription).filter(JobDescription.id == job_description_id).first()
    if not jd:
        raise HTTPException(status_code=404, detail="Job Description not found")

    candidates = []
    
    for file in files:
        file_bytes = await file.read()
        try:
            parsed_text = parse_file(file.filename, file_bytes)
        except ValueError as e:
            # Skip unsupported files but log or continue (simplification for prototype)
            continue
        
        if not parsed_text:
            continue

        # Create candidate entry
        new_candidate = Candidate(
            job_description_id=job_description_id,
            name=file.filename, # Temporary name, LLM will extract real name later
            resume_text=parsed_text,
            status="Pending",
            extracted_data="{}"
        )
        db.add(new_candidate)
        candidates.append(new_candidate)
        
    db.commit()
    for candidate in candidates:
        db.refresh(candidate)

    return candidates

@router.get("/job/{jd_id}", response_model=List[CandidateResponse])
def get_candidates_by_jd(jd_id: int, db: Session = Depends(get_db)):
    candidates = db.query(Candidate).filter(Candidate.job_description_id == jd_id).all()
    return candidates
