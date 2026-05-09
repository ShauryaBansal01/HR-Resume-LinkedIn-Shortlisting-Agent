# 🚀 HR Resume & LinkedIn Shortlisting Agent

An intelligent, AI-powered hiring assistant designed to streamline the recruitment process. This application automatically parses Job Descriptions (JDs) and Resumes, matches candidates using semantic similarity, and generates AI-driven, rubric-based evaluations to help HR professionals quickly shortlist the best candidates.

---

## 🧠 How It Functions (System Workflow)

The application automates the traditional manual screening process through a pipeline of specialized AI agents:

1. **Job Description (JD) Processing:**
   - The user uploads a JD.
   - The **JD Parser Agent** extracts key structured information (Required Skills, Experience level, Core Responsibilities, etc.) using an LLM.
2. **Resume Parsing:**
   - The user uploads candidate resumes (PDF or DOCX).
   - The **Resume Parser Agent** extracts structured details (Candidate Name, Skills, Education, Work History).
3. **Semantic Matching (Vector Search):**
   - The extracted text from both the JD and the Resume are converted into numerical **Vector Embeddings**.
   - A mathematical similarity score is calculated between the two to determine how closely the candidate's profile aligns with the core requirements.
4. **Rubric-Based Evaluation:**
   - The **Rubric Scorer Agent** acts as an AI recruiter, analyzing the resume against the parsed JD constraints.
   - It generates a detailed JSON evaluation outlining the candidate's strengths, weaknesses, and a final rubric score.
5. **Reporting:**
   - The system aggregates the semantic score and the AI rubric score.
   - It can generate a downloadable **PDF Report** summarizing the candidate's fit for the role.

---

## 📂 Folder Structure

The project is organized into two main workspaces: a Python FastAPI backend and a Node.js React frontend.

```text
📦 HR-Resume-LinkedIn-Shortlisting
 ┣ 📂 backend                 # Python backend service
 ┃ ┣ 📂 agents                # LangChain LLM Agents
 ┃ ┃ ┣ 📜 jd_parser.py        # Extracts structured data from JD
 ┃ ┃ ┣ 📜 resume_parser.py    # Extracts structured data from Resumes
 ┃ ┃ ┗ 📜 rubric_scorer.py    # AI evaluator for candidates
 ┃ ┣ 📂 database              # Database configurations
 ┃ ┃ ┗ 📜 db.py               # SQLAlchemy Engine & Base
 ┃ ┣ 📂 embeddings            # Vector Search logic
 ┃ ┃ ┗ 📜 semantic_matcher.py # FAISS similarity calculations
 ┃ ┣ 📂 models                # Data Schemas
 ┃ ┃ ┣ 📜 schema.py           # SQLAlchemy DB Models (Tables)
 ┃ ┃ ┗ 📜 schemas_pydantic.py # Pydantic Models for API validation
 ┃ ┣ 📂 reports               # PDF Output Generation
 ┃ ┃ ┗ 📜 pdf_generator.py    # ReportLab logic for PDF building
 ┃ ┣ 📂 routes                # FastAPI API Endpoints
 ┃ ┃ ┣ 📜 jd_routes.py        
 ┃ ┃ ┣ 📜 report_routes.py    
 ┃ ┃ ┗ 📜 resume_routes.py    
 ┃ ┣ 📂 utils                 # Utility scripts (Loaders, parsers)
 ┃ ┃ ┣ 📜 file_parser.py      # PDF/DOCX text extraction
 ┃ ┃ ┗ 📜 llm_config.py       # LLM setup and API key mapping
 ┃ ┣ 📜 main.py               # FastAPI App Entry Point
 ┃ ┗ 📜 requirements.txt      # Python dependencies
 ┣ 📂 frontend                # React + Vite Frontend
 ┃ ┣ 📂 src                   # React Source Code (Components, Pages, Assets)
 ┃ ┣ 📜 package.json          # Node dependencies and scripts
 ┃ ┣ 📜 tailwind.config.js    # Tailwind CSS Styling Configuration
 ┃ ┗ 📜 vite.config.js        # Vite Bundler Configuration
 ┣ 📜 .gitignore
 ┗ 📜 README.md
```

---

## 📚 Core Libraries Explained

### Backend Libraries (`requirements.txt`)
*   **`fastapi` & `uvicorn`**: 
    *   *What it is:* A modern, fast web framework for building APIs with Python. Uvicorn is the server that runs it.
    *   *How we use it:* To create the REST API endpoints (`/api/jd`, `/api/resume`) that the frontend communicates with.
*   **`sqlalchemy`**: 
    *   *What it is:* The Python SQL Toolkit and Object Relational Mapper (ORM).
    *   *How we use it:* To interact with our database securely using Python classes (e.g., saving candidate scores) instead of writing raw SQL.
*   **`langchain` & `langchain-google-genai`**: 
    *   *What it is:* A framework for developing applications powered by large language models (LLMs).
    *   *How we use it:* To orchestrate our prompts, define our AI agents (Parser, Scorer), and communicate with Google's Gemini LLM to extract meaning from raw text.
*   **`pydantic`**: 
    *   *What it is:* Data validation library using Python type annotations.
    *   *How we use it:* To enforce that the data coming from the Frontend (and from the LLM) matches the exact structure we need (e.g., ensuring the LLM returns JSON with exactly a `name`, `skills`, and `score`).
*   **`faiss-cpu`**: 
    *   *What it is:* A library by Facebook AI for efficient similarity search and clustering of dense vectors.
    *   *How we use it:* We turn text (Resumes and JDs) into arrays of numbers (embeddings) and use FAISS to quickly calculate how closely related those numbers are.
*   **`pymupdf` & `python-docx`**: 
    *   *What it is:* Document parsing libraries.
    *   *How we use it:* To rip raw readable text out of the files (`.pdf` and `.docx`) that the HR manager uploads.
*   **`reportlab`**: 
    *   *What it is:* An open-source PDF generation library.
    *   *How we use it:* To programmatically draw and generate the final "Candidate Report" PDF document.

### Frontend Libraries (`package.json`)
*   **`react` & `react-dom`**: The core framework for building the user interface using reusable components.
*   **`tailwindcss`**: A utility-first CSS framework for rapidly styling the interface without writing custom CSS files.
*   **`shadcn/ui` (Radix UI + Tailwind)**: A collection of accessible, pre-built components (buttons, modals, forms) that are highly customizable.

---

## 🚀 Setup & Installation Guide

To run this project locally, you will need **Python (3.8+)** and **Node.js (18+)** installed on your machine.

### 1️⃣ Setting up the Backend
Open a terminal and navigate to the project root, then into the backend folder:
```bash
cd backend
```

**Step 1: Create a Virtual Environment**
This isolates your Python dependencies from the rest of your system.
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

**Step 2: Install Dependencies**
Install all required libraries mapped out above.
```bash
pip install -r requirements.txt
```

**Step 3: Environment Variables**
Create a `.env` file inside the `backend/` directory and add your LLM API Keys (e.g., Google Gemini):
```env
GOOGLE_API_KEY="your-google-gemini-api-key-here"
```

**Step 4: Run the Server**
Start the FastAPI backend server.
```bash
uvicorn main:app --reload
```
*The backend is now running at `http://localhost:8000` (You can view the interactive API docs at `http://localhost:8000/docs`).*

---

### 2️⃣ Setting up the Frontend
Open a **new** terminal window and navigate to the frontend folder:
```bash
cd frontend
```

**Step 1: Install Dependencies**
Install all the Node modules required by React and Tailwind.
```bash
npm install
```

**Step 2: Start the Development Server**
Launch the Vite React server.
```bash
npm run dev
```
*The frontend is now running, typically at `http://localhost:5173`. Open this link in your browser to view the application!*
