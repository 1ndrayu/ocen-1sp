from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from uuid import uuid4
from typing import List
import httpx
import random

app = FastAPI()

# Cloud Function URLs for ocen-dev1
AA_URL = "https://asia-south1-ocen-dev1.cloudfunctions.net/aa_svc"
LENDER_URL = "https://asia-south1-ocen-dev1.cloudfunctions.net/lender_svc"

class ConsentRequest(BaseModel):
    user_id: str
    data_types: List[str]

@app.post("/aa/consent-request")
async def consent_request(req: ConsentRequest):
    consent_id = str(uuid4())
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(f"{AA_URL}/consent-request", json=req.dict())
            return response.json()
        except Exception:
            return {"consent_id": consent_id, "status": "PENDING"}

@app.get("/aa/consent-status/{consent_id}")
async def consent_status(consent_id: str):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(f"{AA_URL}/consent-status/{consent_id}")
            return response.json()
        except Exception:
            raise HTTPException(status_code=500, detail="AA service unavailable")

@app.post("/loan/apply")
async def apply_loan(request: dict):
    application_id = str(uuid4())
    request["application_id"] = application_id
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(f"{LENDER_URL}/apply", json=request)
            return response.json()
        except Exception as e:
            # Fallback for demo
            return {
                "application_id": application_id,
                "lender_status": random.choice(["approved", "rejected"]),
                "message": f"Processed via fallback (Error: {str(e)})"
            }
