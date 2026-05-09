from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from database.db import get_db
from models.schema import Candidate, JobDescription
from models.schemas_pydantic import CandidateResponse
from utils.file_parser import parse_file
from agents.resume_parser import extract_resume_information
from embeddings.semantic_matcher import evaluate_candidate_similarity
from agents.rubric_scorer import generate_rubric_evaluation
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

        extracted_data_json = extract_resume_information(parsed_text)

        # Basic parsing to extract name from JSON if possible
        import json
        name = file.filename
        try:
            parsed_data = json.loads(extracted_data_json)
            if parsed_data.get("name"):
                name = parsed_data["name"]
        except:
            pass

        # Evaluate Similarity
        jd_json_str = jd.extracted_skills or "{}"
        similarity_scores = evaluate_candidate_similarity(jd_json_str, extracted_data_json)
        
        # Generate Rubric and AI Reasoning
        eval_result = generate_rubric_evaluation(jd_json_str, extracted_data_json, similarity_scores)

        # Create candidate entry
        new_candidate = Candidate(
            job_description_id=job_description_id,
            name=name,
            resume_text=parsed_text,
            status=eval_result["recommendation"],
            extracted_data=extracted_data_json,
            match_score=eval_result["overall_score"],
            skills_score=similarity_scores.get("skills", 0),
            experience_score=similarity_scores.get("experience", 0),
            education_score=similarity_scores.get("education", 0),
            projects_score=similarity_scores.get("projects", 0),
            communication_score=eval_result["communication_score"],
            ai_reasoning=eval_result["ai_reasoning"]
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
