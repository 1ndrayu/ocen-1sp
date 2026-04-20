from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import random

router = APIRouter(prefix="/lender", tags=["Lender"])

class LoanApplication(BaseModel):
    application_id: str
    borrower_name: str
    business_name: str
    loan_amount: float

@router.post("/apply")
def apply_loan(app: LoanApplication):
    # Simulate credit decisioning
    decision = random.choice(["approved", "rejected", "pending"])
    return {
        "application_id": app.application_id,
        "lender_status": decision,
        "message": f"Loan application {decision} by Google Capital Mock Lender"
    }
