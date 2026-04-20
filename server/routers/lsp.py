from fastapi import APIRouter, HTTPException
import httpx
from .aa import create_consent, get_consent_status, ConsentRequest
from .lender import apply_loan, LoanApplication
from uuid import uuid4

router = APIRouter(prefix="/lsp", tags=["Loan Service Provider"])

@router.post("/initiate-consent")
async def initiate_consent(request: dict):
    try:
        # Map frontend request to our schema
        req = ConsentRequest(
            user_id=request.get("user_id", "user_123"),
            data_types=request.get("data_types", ["bank_statement"])
        )
        return create_consent(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/submit-application")
async def submit_application(data: dict):
    try:
        application_id = str(uuid4())
        # Prepare lender application from frontend data
        loan_app = LoanApplication(
            application_id=application_id,
            borrower_name=data.get("business_name", "Anonymous"), # Simplified
            business_name=data.get("business_name", "N/A"),
            loan_amount=float(data.get("loan_amount", 0))
        )
        # Call Lender module logic
        return apply_loan(loan_app)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/check-consent/{consent_id}")
def check_consent(consent_id: str):
    return get_consent_status(consent_id)
