# HR Resume & LinkedIn Shortlisting

An AI-powered application to streamline the hiring process by automatically parsing Job Descriptions (JDs) and Resumes, matching candidates using semantic search, and generating scored rubric evaluations.

## Features

- **Automated Parsing:** Uses LangChain and LLMs to extract structured information (skills, experience, education) from both Job Descriptions and candidate resumes.
- **Semantic Matching:** Utilizes FAISS and vector embeddings to compute a similarity score between a candidate's resume and the job description.
- **Rubric-Based Evaluation:** Employs AI agents to evaluate resumes against JD-specific rubrics, generating structured feedback and scores.
- **Candidate Reports:** Automatically generates detailed PDF reports for shortlisted candidates.
- **Modern Tech Stack:** 
  - **Backend:** FastAPI, SQLAlchemy, LangChain, FAISS, ReportLab
  - **Frontend:** React, Tailwind CSS, shadcn/ui

## Project Structure

- `/backend`: FastAPI application containing routes for JD processing, Resume parsing, semantic embeddings, AI agents, and report generation.
- `/frontend`: React application providing a user-friendly dashboard to upload JDs and Resumes, and view candidate scores.

## Setup Instructions

### Backend
1. Navigate to the `backend` directory.
2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables (e.g., `GOOGLE_API_KEY` or other LLM provider keys) in a `.env` file.
5. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## License
MIT
