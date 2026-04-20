from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from uuid import uuid4
from typing import List
from .aa import create_consent, get_consent_status, ConsentRequest
from .lender import apply_loan, LoanApplication

router = APIRouter(prefix="/lsp", tags=["Loan Service Provider"])

@router.post("/initiate-consent")
def initiate_consent(user_id: str):
    # Call AA module logic directly
    req = ConsentRequest(user_id=user_id, data_types=["bank_statement"])
    return create_consent(req)

@router.get("/check-consent/{consent_id}")
def check_consent(consent_id: str):
    return get_consent_status(consent_id)

@router.post("/submit-application")
def submit_application(data: dict):
    application_id = str(uuid4())
    # Prepare lender application
    loan_app = LoanApplication(
        application_id=application_id,
        borrower_name=data.get("borrower_name", "Anonymous"),
        business_name=data.get("business_name", "N/A"),
        loan_amount=data.get("loan_amount", 0)
    )
    # Call Lender module logic directly
    return apply_loan(loan_app)
