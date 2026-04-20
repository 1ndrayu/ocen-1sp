from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import random
from firebase_admin import firestore

app = FastAPI()
db = firestore.client()

class LoanApplication(BaseModel):
    borrower_name: str
    business_name: str
    loan_amount: float
    loan_purpose: str
    pan: str = None
    gstin: str = None
    application_id: str

class LoanApplicationResponse(BaseModel):
    application_id: str
    lender_status: str
    message: str

@app.post("/apply", response_model=LoanApplicationResponse)
def apply_loan(application: LoanApplication):
    application_id = application.application_id
    loan_status = random.choice(["approved", "rejected"])
    
    loan_data = {
        "status": loan_status,
        "message": "Loan Application Processed",
        "details": application.dict()
    }
    db.collection("loans").document(application_id).set(loan_data)

    return LoanApplicationResponse(
        application_id=application_id,
        lender_status=loan_status,
        message="Loan Application Processed"
    )
