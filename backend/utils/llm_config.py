import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings

load_dotenv()

# Initialize Gemini 2.5 Pro (or the 1.5 Pro equivalent depending on actual available model name)
# Fallback to gemini-1.5-pro if 2.5 is not yet mapped in the library version used.
def get_llm():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable not set")
    return ChatGoogleGenerativeAI(model="gemini-1.5-pro", temperature=0.2)

def get_embeddings():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable not set")
    return GoogleGenerativeAIEmbeddings(model="models/embedding-001")
