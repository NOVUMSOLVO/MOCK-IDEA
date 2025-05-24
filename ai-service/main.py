# MOCK IDEA AI Service - Public Version
# Proprietary algorithms removed for public repository
# Contact contact@novumsolvo.com for commercial access

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import logging

app = FastAPI(title="MOCK IDEA AI Service (Public)", version="1.0.0")

class AnalyzeLogoRequest(BaseModel):
    image: str
    colors: list

class AnalyzeLogoResponse(BaseModel):
    style: str
    complexity: int
    hasText: bool
    recommendedCategories: list

@app.post("/analyze-logo", response_model=AnalyzeLogoResponse)
async def analyze_logo(request: AnalyzeLogoRequest):
    """
    Logo analysis endpoint - Public version with limited functionality
    Full AI analysis requires commercial license
    """
    raise HTTPException(
        status_code=501,
        detail="Advanced AI analysis requires commercial license. Contact contact@novumsolvo.com"
    )

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "Public AI service - Limited functionality"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
