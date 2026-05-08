from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from backend.database.db import get_db
from backend.models.schema import JobDescription
from backend.models.schemas_pydantic import JobDescriptionResponse
from backend.utils.file_parser import parse_file
from backend.agents.jd_parser import extract_jd_information

router = APIRouter(prefix="/api/jd", tags=["Job Description"])

@router.post("/upload", response_model=JobDescriptionResponse)
async def upload_jd(
    title: str = Form(...),
    file: UploadFile = File(None),
    text: str = Form(None),
    db: Session = Depends(get_db)
):
    """
    Upload a Job Description either by providing raw text or uploading a file (PDF/DOCX).
    """
    if not file and not text:
        raise HTTPException(status_code=400, detail="Must provide either text or file upload.")
    
    parsed_text = ""
    if file:
        file_bytes = await file.read()
        try:
            parsed_text = parse_file(file.filename, file_bytes)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
    elif text:
        parsed_text = text.strip()

    if not parsed_text:
        raise HTTPException(status_code=400, detail="Could not extract text from the provided input.")

    extracted_skills_json = extract_jd_information(parsed_text)

    new_jd = JobDescription(
        title=title,
        description_text=parsed_text,
        extracted_skills=extracted_skills_json
    )
    db.add(new_jd)
    db.commit()
    db.refresh(new_jd)

    return new_jd

@router.get("/{jd_id}", response_model=JobDescriptionResponse)
def get_jd(jd_id: int, db: Session = Depends(get_db)):
    jd = db.query(JobDescription).filter(JobDescription.id == jd_id).first()
    if not jd:
        raise HTTPException(status_code=404, detail="Job Description not found")
    return jd
