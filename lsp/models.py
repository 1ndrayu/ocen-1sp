from pydantic import BaseModel
from typing import Optional, List

# Data model for Loan Application
class LoanApplicationRequest(BaseModel):
    borrower_name: str
    business_name: str
    loan_amount: float
    loan_purpose: str
    pan: Optional[str] = None
    gstin: Optional[str] = None

class LoanApplicationResponse(BaseModel):
    application_id: str
    consent_id: Optional[str] = None
    consent_status: Optional[str] = None

# Consent request and response models
class ConsentRequest(BaseModel):
    user_id: str
    data_types: List[str]

class ConsentStatus(BaseModel):
    consent_id: str
    status: str
