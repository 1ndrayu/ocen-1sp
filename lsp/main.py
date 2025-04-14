from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import httpx
import uuid
from typing import Optional, List

app = FastAPI(title="OCEN Loan Service Provider (LSP)")

LENDER_URL = "http://localhost:9000/lender/apply"  # Mock lender endpoint
AA_BASE_URL = "http://127.0.0.1:7000"  # Account Aggregator URL

class LoanApplicationRequest(BaseModel):
    application_id: str
    borrower_name: str
    business_name: str
    loan_amount: float
    loan_purpose: str
    gstin: Optional[str] = None
    pan: Optional[str] = None
    financial_data: Optional[dict] = None  # Placeholder for financial data

class LoanApplicationResponse(BaseModel):
    application_id: str
    consent_id: Optional[str] = None
    consent_status: Optional[str] = None
    lender_status: Optional[str] = None
    message: Optional[str] = None

@app.post("/loan/apply", response_model=LoanApplicationResponse)
async def apply_loan(request: LoanApplicationRequest):
    try:
        application_id = str(uuid.uuid4())  # Generate unique application ID
        payload = request.dict()
        payload["application_id"] = application_id  # Add application ID

        if request.financial_data:
            payload["financial_data"] = request.financial_data

        # Send loan application to lender
        async with httpx.AsyncClient() as client:
            response = await client.post(LENDER_URL, json=payload)
            if response.status_code != 200:
                raise HTTPException(status_code=500, detail="Lender rejected application")

        lender_response = response.json()

        return LoanApplicationResponse(
            application_id=application_id,
            consent_id=lender_response.get("consent_id", "default-consent-id"),
            consent_status=lender_response.get("consent_status", "approved"),
            lender_status=lender_response.get("status", "Unknown"),
            message=lender_response.get("message", "Application processed.")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")

# Functions to interact with Account Aggregator
async def request_consent(user_id: str, data_types: List[str]):
    payload = {"user_id": user_id, "data_types": data_types}
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{AA_BASE_URL}/aa/consent-request", json=payload)
        return response.json()

async def check_consent_status(consent_id: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{AA_BASE_URL}/aa/consent-status/{consent_id}")
        return response.json()

async def fetch_financial_data(consent_id: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{AA_BASE_URL}/aa/fetch-data/{consent_id}")
        return response.json()
