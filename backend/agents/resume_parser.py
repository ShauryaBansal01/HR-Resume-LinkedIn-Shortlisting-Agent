from pydantic import BaseModel, Field
from typing import List, Optional
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from utils.llm_config import get_llm

class ExtractedResume(BaseModel):
    name: str = Field(description="Full name of the candidate")
    email: Optional[str] = Field(description="Email address")
    phone: Optional[str] = Field(description="Phone number")
    skills: List[str] = Field(description="List of technical and soft skills")
    projects: List[str] = Field(description="List of projects mentioned")
    certifications: List[str] = Field(description="List of certifications")
    experience_years: int = Field(description="Total estimated years of experience. Use 0 if none.")
    experience_details: List[str] = Field(description="Details of past work experience")
    education: List[str] = Field(description="Educational background degrees and institutions")
    links: List[str] = Field(description="Any LinkedIn, GitHub, or portfolio links")

def extract_resume_information(resume_text: str) -> str:
    """
    Extracts structured information from raw Resume text using LLM.
    Returns JSON string of the ExtractedResume.
    """
    try:
        llm = get_llm()
    except ValueError as e:
        return "{}"

    parser = PydanticOutputParser(pydantic_object=ExtractedResume)
    
    prompt = PromptTemplate(
        template="Extract the following information from the candidate's resume.\n{format_instructions}\n\nResume:\n{resume_text}\n",
        input_variables=["resume_text"],
        partial_variables={"format_instructions": parser.get_format_instructions()}
    )
    
    chain = prompt | llm | parser
    
    try:
        result = chain.invoke({"resume_text": resume_text})
        return result.model_dump_json()
    except Exception as e:
        print(f"Error extracting Resume info: {e}")
        return "{}"
