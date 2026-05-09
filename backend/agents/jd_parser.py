from pydantic import BaseModel, Field
from typing import List, Optional
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from utils.llm_config import get_llm
import json

class ExtractedSkills(BaseModel):
    required_skills: List[str] = Field(description="List of required technical and soft skills")
    years_of_experience: str = Field(description="Required years of experience")
    education: str = Field(description="Required education level (e.g. Bachelor's, Master's)")
    certifications: List[str] = Field(description="Required certifications")
    soft_skills: List[str] = Field(description="List of soft skills mentioned")
    tools: List[str] = Field(description="List of tools and frameworks required")
    responsibilities: List[str] = Field(description="Key responsibilities listed in the job description")

def extract_jd_information(jd_text: str) -> str:
    """
    Extracts structured information from raw JD text using LLM.
    Returns JSON string of the ExtractedSkills.
    """
    try:
        llm = get_llm()
    except ValueError as e:
        # If API key is not set, return empty json for now.
        return "{}"

    parser = PydanticOutputParser(pydantic_object=ExtractedSkills)
    
    prompt = PromptTemplate(
        template="Extract the following information from the job description.\n{format_instructions}\n\nJob Description:\n{jd_text}\n",
        input_variables=["jd_text"],
        partial_variables={"format_instructions": parser.get_format_instructions()}
    )
    
    chain = prompt | llm | parser
    
    try:
        result = chain.invoke({"jd_text": jd_text})
        return result.model_dump_json()
    except Exception as e:
        print(f"Error extracting JD info: {e}")
        return "{}"
