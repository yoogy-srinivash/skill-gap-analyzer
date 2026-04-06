from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.schemas import AnalyzeRequest, AnalyzeResponse, ResumeRequest, ResumeResponse
from app.analyze import analyze_skills, get_available_roles, extract_skills_from_resume, ROLES_DATA
from app.auth import router as auth_router, get_current_user
from app.database import engine, get_db
from app import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Skill Gap Analyzer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["Authentication"])


@app.get("/")
def root():
    return {"message": "Skill Gap Analyzer API is running"}


@app.get("/roles")
def get_roles():
    return {"roles": get_available_roles()}


@app.get("/roles/{role}/skills")
def get_role_skills(role: str):
    if role not in ROLES_DATA:
        raise HTTPException(status_code=404, detail="Role not found")
    return {
        "role": role,
        "skills": ROLES_DATA[role]["skills"],
        "categories": ROLES_DATA[role].get("categories", {})
    }


@app.post("/resume/extract", response_model=ResumeResponse)
def extract_resume_skills(
    request: ResumeRequest,
    authorization: str = Header(...),
    db: Session = Depends(get_db)
):
    token = authorization.replace("Bearer ", "")
    get_current_user(token, db)

    if not request.resume_text.strip():
        raise HTTPException(status_code=400, detail="Resume text cannot be empty")

    extracted = extract_skills_from_resume(request.resume_text)
    return {"extracted_skills": extracted}


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(
    request: AnalyzeRequest,
    authorization: str = Header(...),
    db: Session = Depends(get_db)
):
    token = authorization.replace("Bearer ", "")
    get_current_user(token, db)

    if not request.skills:
        raise HTTPException(status_code=400, detail="Skills list cannot be empty")
    if not request.role:
        raise HTTPException(status_code=400, detail="Role cannot be empty")

    result = analyze_skills(request.role, request.skills)

    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])

    return result