from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from uuid import uuid4
from typing import List
import random

router = APIRouter(prefix="/aa", tags=["Account Aggregator"])

# Temporary in-memory store for demo (can be moved to Firestore later)
consents = {}

class ConsentRequest(BaseModel):
    user_id: str
    data_types: List[str]

@router.post("/consent-request")
def create_consent(req: ConsentRequest):
    consent_id = f"consent_{uuid4().hex[:8]}"
    consents[consent_id] = {
        "user_id": req.user_id,
        "data_types": req.data_types,
        "status": "PENDING"
    }
    return {"consent_id": consent_id, "status": "PENDING"}

@router.get("/consent-status/{consent_id}")
def get_consent_status(consent_id: str):
    if consent_id not in consents:
        raise HTTPException(status_code=404, detail="Consent ID not found")
    
    if consents[consent_id]["status"] == "PENDING":
        consents[consent_id]["status"] = random.choice(["APPROVED", "REJECTED"])
    
    return {"consent_id": consent_id, "status": consents[consent_id]["status"]}

@router.get("/fetch-data/{consent_id}")
def fetch_data(consent_id: str):
    if consent_id not in consents or consents[consent_id]["status"] != "APPROVED":
        raise HTTPException(status_code=403, detail="Consent not approved or not found")

    return {
        "bank_statement": {
            "account_number": "1234567890",
            "bank_name": "Mock Bank",
            "closing_balance": 23000,
            "transactions": [
                {"date": "2025-04-01", "description": "Sales Revenue", "amount": 30000},
                {"date": "2025-04-05", "description": "Utility Bill", "amount": -2000},
            ]
        }
    }
