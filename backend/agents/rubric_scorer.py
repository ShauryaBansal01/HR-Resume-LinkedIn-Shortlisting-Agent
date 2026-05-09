from pydantic import BaseModel, Field
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from utils.llm_config import get_llm
import json

class RubricEvaluation(BaseModel):
    communication_score: float = Field(description="Score out of 100 for communication quality based on resume writing")
    ai_reasoning: str = Field(description="Detailed explainable AI reasoning for the candidate's match")
    recommendation: str = Field(description="Hiring recommendation: 'Strong Match', 'Moderate Match', 'Weak Match', or 'Rejected'")

def generate_rubric_evaluation(jd_json: str, candidate_json: str, similarity_scores: dict) -> dict:
    """
    Uses LLM to evaluate communication and generate explainable AI reasoning.
    Calculates final weighted scores based on the mandatory rubric:
    Skills: 30%, Experience: 25%, Education: 15%, Projects: 20%, Communication: 10%
    """
    try:
        llm = get_llm()
    except ValueError:
        return {
            "communication_score": 0.0,
            "ai_reasoning": "API Key missing. Cannot generate AI reasoning.",
            "recommendation": "Pending",
            "overall_score": sum([
                similarity_scores.get('skills', 0) * 0.30,
                similarity_scores.get('experience', 0) * 0.25,
                similarity_scores.get('education', 0) * 0.15,
                similarity_scores.get('projects', 0) * 0.20
            ]) / 0.90 # Normalized to 90%
        }

    parser = PydanticOutputParser(pydantic_object=RubricEvaluation)
    
    prompt = PromptTemplate(
        template="""You are an expert HR AI Assistant. Evaluate the candidate against the Job Description.
        
{format_instructions}

Job Description:
{jd_json}

Candidate Profile:
{candidate_json}

Similarity Scores (for context):
{similarity_scores}

Provide a communication score (0-100) based on how well the resume is written, the detailed AI reasoning explaining strengths and weaknesses, and a final recommendation.
""",
        input_variables=["jd_json", "candidate_json", "similarity_scores"],
        partial_variables={"format_instructions": parser.get_format_instructions()}
    )
    
    chain = prompt | llm | parser
    
    try:
        result = chain.invoke({
            "jd_json": jd_json,
            "candidate_json": candidate_json,
            "similarity_scores": json.dumps(similarity_scores)
        })
        
        # Calculate final weighted score
        final_score = (
            similarity_scores.get("skills", 0) * 0.30 +
            similarity_scores.get("experience", 0) * 0.25 +
            similarity_scores.get("education", 0) * 0.15 +
            similarity_scores.get("projects", 0) * 0.20 +
            result.communication_score * 0.10
        )
        
        return {
            "communication_score": result.communication_score,
            "ai_reasoning": result.ai_reasoning,
            "recommendation": result.recommendation,
            "overall_score": final_score
        }
    except Exception as e:
        print(f"Error in rubric evaluation: {e}")
        return {
            "communication_score": 0.0,
            "ai_reasoning": "Failed to generate AI reasoning.",
            "recommendation": "Pending",
            "overall_score": 0.0
        }
