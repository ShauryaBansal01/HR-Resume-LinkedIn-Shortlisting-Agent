from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
import io
import json

def generate_candidate_report(candidate) -> bytes:
    """
    Generates a PDF report for a candidate.
    Returns the PDF as bytes.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=72, leftMargin=72, topMargin=72, bottomMargin=18)
    
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name='CustomTitle', fontSize=18, spaceAfter=14, fontName='Helvetica-Bold'))
    styles.add(ParagraphStyle(name='CustomNormal', fontSize=10, spaceAfter=10, fontName='Helvetica'))
    styles.add(ParagraphStyle(name='Highlight', fontSize=12, spaceAfter=10, fontName='Helvetica-Bold', textColor=colors.HexColor('#0f172a')))

    elements = []

    # Title
    elements.append(Paragraph(f"Candidate Evaluation Report: {candidate.name}", styles['CustomTitle']))
    elements.append(Spacer(1, 12))

    # Basic Info Table
    data = [
        ['Status/Recommendation:', candidate.status],
        ['Overall Match Score:', f"{candidate.match_score:.1f}%" if candidate.match_score else "N/A"],
        ['Human Override Score:', f"{candidate.human_override_score:.1f}%" if candidate.human_override_score else "None"],
    ]
    t = Table(data, colWidths=[200, 200])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,-1), colors.lightgrey),
        ('TEXTCOLOR', (0,0), (-1,-1), colors.black),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('FONTNAME', (0,0), (-1,-1), 'Helvetica'),
        ('FONTSIZE', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('GRID', (0,0), (-1,-1), 1, colors.grey)
    ]))
    elements.append(t)
    elements.append(Spacer(1, 24))

    # Rubric Breakdown
    elements.append(Paragraph("Rubric Breakdown", styles['Highlight']))
    rubric_data = [
        ['Dimension', 'Score (%)'],
        ['Skills Match (30%)', f"{candidate.skills_score:.1f}%" if candidate.skills_score else "N/A"],
        ['Experience Relevance (25%)', f"{candidate.experience_score:.1f}%" if candidate.experience_score else "N/A"],
        ['Education (15%)', f"{candidate.education_score:.1f}%" if candidate.education_score else "N/A"],
        ['Projects/Portfolio (20%)', f"{candidate.projects_score:.1f}%" if candidate.projects_score else "N/A"],
        ['Communication (10%)', f"{candidate.communication_score:.1f}%" if candidate.communication_score else "N/A"],
    ]
    t2 = Table(rubric_data, colWidths=[200, 100])
    t2.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (1,0), colors.HexColor('#0f172a')),
        ('TEXTCOLOR', (0,0), (1,0), colors.whitesmoke),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('GRID', (0,0), (-1,-1), 1, colors.grey)
    ]))
    elements.append(t2)
    elements.append(Spacer(1, 24))

    # AI Reasoning
    elements.append(Paragraph("Explainable AI Reasoning", styles['Highlight']))
    reasoning_text = candidate.ai_reasoning or "No AI reasoning provided."
    elements.append(Paragraph(reasoning_text, styles['CustomNormal']))
    elements.append(Spacer(1, 12))

    # Human Override Details (if any)
    if candidate.human_override_reason:
        elements.append(Paragraph("Human Override Justification", styles['Highlight']))
        elements.append(Paragraph(candidate.human_override_reason, styles['CustomNormal']))

    doc.build(elements)
    
    return buffer.getvalue()
