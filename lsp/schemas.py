from pydantic import BaseModel
from typing import List, Optional

# Loan Application Request Model (Complies with OCEN)
class LoanApplicationRequest(BaseModel):
    application_id: str
    borrower_name: str
    business_name: str
    loan_amount: float
    loan_purpose: str
    gstin: Optional[str] = None
    pan: Optional[str] = None
    financial_data: Optional[dict] = None  # Placeholder for consented financial data

# Loan Application Response Model (Complies with OCEN)
class LoanApplicationResponse(BaseModel):
    application_id: str
    consent_id: Optional[str] = None  # Optional
    consent_status: Optional[str] = None  # Optional
    lender_status: Optional[str] = None  # Status from lender (approved, rejected, etc.)
    message: Optional[str] = None  # Message from the lender

# Account Aggregator Consent Request Model
class ConsentRequest(BaseModel):
    user_id: str
    data_types: List[str]  # Data types like bank_statement, tax_returns, etc.
