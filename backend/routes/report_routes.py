from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.orm import Session
from backend.database.db import get_db
from backend.models.schema import Candidate
from backend.reports.pdf_generator import generate_candidate_report

router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.get("/candidate/{candidate_id}/pdf")
def download_candidate_report(candidate_id: int, db: Session = Depends(get_db)):
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    try:
        pdf_bytes = generate_candidate_report(candidate)
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=candidate_{candidate_id}_report.pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
