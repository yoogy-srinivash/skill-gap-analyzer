from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import json
import os
import re

MODEL = SentenceTransformer("all-MiniLM-L6-v2")

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "roles.json")
with open(DATA_PATH, "r") as f:
    ROLES_DATA = json.load(f)

ROADMAP_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "roadmap.json")
with open(ROADMAP_PATH, "r") as f:
    ROADMAP_DATA = json.load(f)

SIMILARITY_THRESHOLD = 0.55


def get_embedding(text: str):
    return MODEL.encode([text])[0]


def get_embeddings(texts: list):
    return MODEL.encode(texts)


def extract_skills_from_resume(resume_text: str) -> list[str]:
    all_skills = set()
    for role_data in ROLES_DATA.values():
        all_skills.update(role_data["skills"])

    resume_lower = resume_text.lower()
    exact_matched = set()
    remaining_skills = []

    for skill in all_skills:
        if skill.lower() in resume_lower:
            exact_matched.add(skill)
        else:
            remaining_skills.append(skill)

    if not remaining_skills:
        return list(exact_matched)

    tokens = resume_text.split()
    phrases = set()
    for i in range(len(tokens)):
        phrases.add(tokens[i])
    for i in range(len(tokens) - 1):
        phrases.add(f"{tokens[i]} {tokens[i+1]}")
    for i in range(len(tokens) - 2):
        phrases.add(f"{tokens[i]} {tokens[i+1]} {tokens[i+2]}")

    candidates = [p for p in phrases if len(p) >= 2]

    if not candidates:
        return list(exact_matched)

    skill_embeddings = get_embeddings(remaining_skills)
    candidate_embeddings = get_embeddings(candidates)

    semantic_matched = set()
    for i, skill in enumerate(remaining_skills):
        skill_emb = skill_embeddings[i].reshape(1, -1)
        scores = cosine_similarity(skill_emb, candidate_embeddings)[0]
        if scores.max() >= 0.78:
            semantic_matched.add(skill)

    return list(exact_matched | semantic_matched)


def get_recommendations_with_roadmap(missing_skills: list[str]) -> list[dict]:
    result = []
    for skill in missing_skills:
        data = ROADMAP_DATA.get(skill, {
            "roadmap": [
                f"Learn {skill} fundamentals",
                f"Practice {skill} with small exercises",
                f"Build a project using {skill}"
            ],
            "projects": [
                f"Build a beginner {skill} project",
                f"Create an intermediate {skill} app",
                f"Contribute to a {skill} open source project"
            ]
        })
        result.append({
            "skill": skill,
            "roadmap": data["roadmap"],
            "projects": data["projects"]
        })
    return result


def analyze_skills(role: str, user_skills: list[str]) -> dict:
    if role not in ROLES_DATA:
        return {"error": f"Role '{role}' not found."}

    required_skills = ROLES_DATA[role]["skills"]
    weights = ROLES_DATA[role].get("weights", {})
    user_embeddings = get_embeddings(user_skills)
    required_embeddings = get_embeddings(required_skills)

    matched = []
    missing = []
    total_weight = sum(weights.get(s, 1.0) for s in required_skills)
    matched_weight = 0.0

    for i, req_skill in enumerate(required_skills):
        req_emb = required_embeddings[i].reshape(1, -1)
        best_score = 0.0
        best_match = None

        for j, user_skill in enumerate(user_skills):
            user_emb = user_embeddings[j].reshape(1, -1)
            score = cosine_similarity(req_emb, user_emb)[0][0]
            if score > best_score:
                best_score = score
                best_match = user_skill

        skill_weight = weights.get(req_skill, 1.0)

        if best_score >= SIMILARITY_THRESHOLD:
            matched_weight += skill_weight
            matched.append({
                "required": req_skill,
                "matched_with": best_match,
                "score": round(float(best_score), 2),
                "weight": skill_weight
            })
        else:
            missing.append({
                "skill": req_skill,
                "best_score": round(float(best_score), 2),
                "weight": skill_weight
            })

    match_percentage = round((matched_weight / total_weight) * 100)
    missing_sorted = sorted(missing, key=lambda x: x["weight"], reverse=True)
    missing_skill_names = [m["skill"] for m in missing_sorted]
    recommendations = get_recommendations_with_roadmap(missing_skill_names)

    similar_roles = suggest_similar_roles(user_skills, role)

    return {
        "role": role,
        "match_percentage": match_percentage,
        "matched_skills": matched,
        "missing_skills": missing_skill_names,
        "recommendations": recommendations,
        "similar_roles": similar_roles,
        "total_required": len(required_skills),
        "total_matched": len(matched)
    }

def suggest_similar_roles(user_skills: list[str], current_role: str, top_n: int = 3) -> list[dict]:
    suggestions = []

    for role, role_data in ROLES_DATA.items():
        if role == current_role:
            continue

        required_skills = role_data["skills"]
        weights = role_data.get("weights", {})
        user_embeddings = get_embeddings(user_skills)
        required_embeddings = get_embeddings(required_skills)

        total_weight = sum(weights.get(s, 1.0) for s in required_skills)
        matched_weight = 0.0

        for i, req_skill in enumerate(required_skills):
            req_emb = required_embeddings[i].reshape(1, -1)
            best_score = 0.0

            for j in range(len(user_skills)):
                user_emb = user_embeddings[j].reshape(1, -1)
                score = cosine_similarity(req_emb, user_emb)[0][0]
                if score > best_score:
                    best_score = score

            if best_score >= SIMILARITY_THRESHOLD:
                matched_weight += weights.get(req_skill, 1.0)

        match_pct = round((matched_weight / total_weight) * 100)
        suggestions.append({"role": role, "match_percentage": match_pct})

    suggestions_sorted = sorted(suggestions, key=lambda x: x["match_percentage"], reverse=True)
    return suggestions_sorted[:top_n]

def get_available_roles() -> list:
    return list(ROLES_DATA.keys())