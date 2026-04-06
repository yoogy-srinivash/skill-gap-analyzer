from pydantic import BaseModel
from typing import Optional

class AnalyzeRequest(BaseModel):
    role: str
    skills: list[str]

class ResumeRequest(BaseModel):
    resume_text: str

class ResumeResponse(BaseModel):
    extracted_skills: list[str]

class RoadmapItem(BaseModel):
    skill: str
    roadmap: list[str]
    projects: list[str]

class SimilarRole(BaseModel):
    role: str
    match_percentage: int

class AnalyzeResponse(BaseModel):
    role: str
    match_percentage: int
    matched_skills: list
    missing_skills: list[str]
    recommendations: list[RoadmapItem]
    similar_roles: list[SimilarRole]
    total_required: int
    total_matched: int

class UserRegister(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str