import json
import numpy as np
import faiss
from backend.utils.llm_config import get_embeddings

def compute_similarity(text1: str, text2: str) -> float:
    """
    Computes cosine similarity between two text strings using embeddings.
    """
    try:
        embeddings_model = get_embeddings()
    except ValueError:
        # Fallback if no API key
        return 0.0

    try:
        # Generate embeddings
        emb1 = np.array(embeddings_model.embed_query(text1), dtype='float32')
        emb2 = np.array(embeddings_model.embed_query(text2), dtype='float32')
        
        # Normalize vectors for cosine similarity
        emb1 = emb1 / np.linalg.norm(emb1)
        emb2 = emb2 / np.linalg.norm(emb2)
        
        # Compute dot product
        similarity = np.dot(emb1, emb2)
        # Normalize to 0-100 range and cap at 100
        score = float(similarity) * 100
        return max(0.0, min(100.0, score))
    except Exception as e:
        print(f"Error computing similarity: {e}")
        return 0.0

def evaluate_candidate_similarity(jd_json: str, candidate_json: str) -> dict:
    """
    Evaluates candidate against JD across multiple dimensions using vector similarity.
    Returns a dictionary of raw similarity scores (0-100).
    """
    scores = {
        "skills": 0.0,
        "experience": 0.0,
        "education": 0.0,
        "projects": 0.0,
        "communication": 0.0 # Will be evaluated by LLM logic later, but placeholder here
    }

    try:
        jd = json.loads(jd_json)
        candidate = json.loads(candidate_json)
    except Exception:
        return scores

    # 1. Skills Match
    jd_skills = ", ".join(jd.get("required_skills", []) + jd.get("tools", []))
    cand_skills = ", ".join(candidate.get("skills", []))
    if jd_skills and cand_skills:
        scores["skills"] = compute_similarity(jd_skills, cand_skills)

    # 2. Experience Match
    jd_exp = f"{jd.get('years_of_experience', '')} - {', '.join(jd.get('responsibilities', []))}"
    cand_exp = "\n".join(candidate.get("experience_details", []))
    if jd_exp and cand_exp:
        scores["experience"] = compute_similarity(jd_exp, cand_exp)

    # 3. Education Match
    jd_edu = jd.get("education", "")
    cand_edu = ", ".join(candidate.get("education", []))
    if jd_edu and cand_edu:
        scores["education"] = compute_similarity(jd_edu, cand_edu)

    # 4. Projects/Portfolio Match
    jd_proj_req = ", ".join(jd.get("required_skills", [])) # Using skills as proxy for project requirements
    cand_proj = ", ".join(candidate.get("projects", []))
    if jd_proj_req and cand_proj:
        scores["projects"] = compute_similarity(jd_proj_req, cand_proj)
        
    return scores
