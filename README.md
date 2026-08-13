# ResumeIQ — AI Resume Analyzer

Upload a PDF/DOCX resume, get an AI-generated ATS-style analysis (scores, skills, strengths,
improvements), compare it against a job description, and keep a history of past analyses.

Flow: **React → FastAPI → Pydantic → Resume parsing → Gemini AI → SQLite → React results**

## Features

- Landing page + dashboard with sidebar (Dashboard / Analyze / History)
- PDF & DOCX upload (max 5 MB) with filename, size and remove control
- Optional target job role
- Overall score ring + breakdown (ATS, keywords, skills, formatting)
- Matched vs missing skills, AI summary, strengths, improvements, project feedback
- Job description matching (match score, matching skills, missing keywords, recommended changes)
- History stored in SQLite: view and delete previous analyses
- Toast notifications, loading/error/empty states

## Tech stack

| Layer     | Tech                                             |
| --------- | ------------------------------------------------ |
| Frontend  | React, TypeScript, Tailwind CSS, shadcn/ui       |
| Backend   | FastAPI, Python, Pydantic, SQLAlchemy            |
| AI        | Google Gemini API                                |
| Database  | SQLite                                           |

## Folder structure

```
backend/
├── main.py                 # FastAPI app + CORS
├── database.py             # SQLite engine/session
├── models.py               # SQLAlchemy Analysis model
├── schemas.py              # Pydantic schemas (AI response contract)
├── requirements.txt
├── services/
│   ├── resume_parser.py    # PyMuPDF + python-docx text extraction
│   └── gemini_service.py   # Gemini prompts -> structured JSON
└── routes/
    ├── resume.py           # /api/resume/analyze, /api/resume/job-match
    └── analysis.py         # /api/history endpoints

src/
├── lib/api.ts              # centralized API service (VITE_API_URL)
├── lib/types.ts            # shared TS types
├── components/             # AppShell, ScoreRing, AnalysisResults, JobMatchPanel
└── routes/                 # / , /dashboard , /analyze , /history , /history/$id
```

## API endpoints

| Method | Path                     | Purpose                                  |
| ------ | ------------------------ | ---------------------------------------- |
| POST   | `/api/resume/analyze`    | Upload resume + target_role, get analysis |
| POST   | `/api/resume/job-match`  | Compare resume text with a job description |
| GET    | `/api/history`           | List saved analyses                      |
| GET    | `/api/history/{id}`      | Get one saved analysis                   |
| DELETE | `/api/history/{id}`      | Delete a saved analysis                  |

## Environment variables

Backend — `backend/.env` (see `backend/.env.example`):

```
GEMINI_API_KEY=your_key_here
```

Frontend — `.env` (see `.env.example`):

```
VITE_API_URL=http://localhost:8000
```

The Gemini key is only ever read on the server; it is never exposed to React.

## Backend setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env             # then add your GEMINI_API_KEY
uvicorn main:app --reload --port 8000
```

API docs: http://localhost:8000/docs — health check: http://localhost:8000/api/health

## Frontend setup

```bash
npm install
cp .env.example .env             # VITE_API_URL=http://localhost:8000
npm run dev
```

Open the dev server URL, go to **Analyze**, upload a resume and run the analysis.
Both servers must be running for analysis and history to work.
