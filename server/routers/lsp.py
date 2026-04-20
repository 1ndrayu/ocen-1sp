from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import uuid

router = APIRouter(prefix="/lsp", tags=["LSP"])

class ConsentRequest(BaseModel):
    user_id: str
    data_types: List[str]

class ApplicationRequest(BaseModel):
    business_name: str
    pan: str
    loan_amount: float
    consent_id: str

@router.post("/initiate-consent")
async def initiate_consent(req: ConsentRequest):
    print(f"[*] Consent initiated for user: {req.user_id}")
    return {
        "consent_id": f"con_{uuid.uuid4().hex[:8]}",
        "status": "INITIATED",
        "message": "Consent request created successfully"
    }

@router.post("/submit-application")
async def submit_application(req: ApplicationRequest):
    print(f"[*] Application submitted for: {req.business_name}")
    # Mocking lender approval flow
    return {
        "application_id": f"APP-{uuid.uuid4().hex[:6].upper()}",
        "status": "approved",
        "lender": "Google Capital",
        "amount": req.loan_amount
    }
