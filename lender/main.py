from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import random
from uuid import uuid4
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Mock Lender Service")

origins = [
    "http://localhost:3000",  # React app's URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Mock in-memory store for loans
loans = {}

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

@app.post("/lender/apply", response_model=LoanApplicationResponse)
def apply_loan(application: LoanApplication):
    application_id = application.application_id
    loan_status = random.choice(["approved", "rejected"])
    
    loans[application_id] = {
        "status": loan_status,
        "message": "Loan Application Processed"
    }

    return LoanApplicationResponse(
        application_id=application_id,
        lender_status=loan_status,
        message="Loan Application Processed"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
