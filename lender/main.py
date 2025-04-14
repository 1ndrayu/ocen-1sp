from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from uuid import uuid4
from typing import Optional

app = FastAPI(title="Basic Lender API")

# Request Model for Loan Application
class LoanApplication(BaseModel):
    borrower_name: str
    business_name: str
    loan_amount: float
    loan_purpose: str
    pan: Optional[str] = None
    gstin: Optional[str] = None
    application_id: str

# Loan Status Enum
class LoanStatus(str):
    APPROVED = "approved"
    REJECTED = "rejected"
    PENDING = "pending"

# Simulate Loan Approval Logic (Basic)
def evaluate_application(application: LoanApplication):
    if application.loan_amount > 1000000:
        return LoanStatus.REJECTED  # Reject loans over ₹10,00,000
    elif application.loan_amount < 50000:
        return LoanStatus.REJECTED  # Reject small loans below ₹50,000
    else:
        return LoanStatus.APPROVED  # Approve loans between ₹50,000 and ₹10,00,000

# Lender Endpoint to Receive Loan Application
@app.post("/lender/apply")
async def apply_loan(application: LoanApplication):
    # Evaluate the application and determine the status
    loan_status = evaluate_application(application)

    # Return Loan Status
    return {
        "application_id": application.application_id,
        "status": loan_status,
        "message": f"Loan application {loan_status}."
    }

# Endpoint to Check Loan Status (for LSP to track)
@app.get("/lender/status/{application_id}")
async def get_loan_status(application_id: str):
    # For now, mock a loan status retrieval
    # Ideally, this should fetch the status from a database or another system
    return {
        "application_id": application_id,
        "status": LoanStatus.PENDING,  # Assuming pending until integrated
        "message": "Loan application is pending."
    }
