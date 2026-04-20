from pydantic import BaseModel
from typing import Optional, List

class LoanApplicationOCEN(BaseModel):
    borrower_name: str
    business_name: str
    loan_amount: float
    loan_purpose: str
    consent_id: str  # Consent ID to link with AA
    application_id: str

class ConsentRequestOCEN(BaseModel):
    user_id: str
    data_types: List[str]  # List of data types requested (e.g., bank_statement)

class ConsentResponseOCEN(BaseModel):
    consent_id: str
    status: str  # "APPROVED", "REJECTED"
