from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from uuid import uuid4
from typing import Optional, List, Dict
import random
import time

app = FastAPI(title="OCEN Mock Account Aggregator Service")

# In-memory store for consents
consents: Dict[str, Dict] = {}

# OCEN Data Models (mock)
class ConsentRequest(BaseModel):
    user_id: str
    data_types: List[str]  # e.g., ["bank_statement", "tax_returns"]

class ConsentStatusResponse(BaseModel):
    consent_id: str
    status: str  # Pending, Approved, Rejected, Expired
    message: str  # Message describing the status

class BankStatement(BaseModel):
    account_number: str
    bank_name: str
    transactions: List[Dict]  # Each transaction is a dictionary
    closing_balance: float

class ConsentData(BaseModel):
    consent_id: str
    data: Dict[str, BankStatement]  # Mapping of data type to bank statement (for simplicity)

class ConsentResponse(BaseModel):
    consent_id: str
    status: str
    message: str
    data: Optional[Dict[str, BankStatement]] = None

# OCEN consent request endpoint
@app.post("/aa/consent-request", response_model=ConsentResponse)
def create_consent(req: ConsentRequest):
    consent_id = f"consent_{uuid4().hex[:8]}"
    consents[consent_id] = {
        "user_id": req.user_id,
        "data_types": req.data_types,
        "status": "PENDING",
        "request_time": time.time()
    }
    return ConsentResponse(
        consent_id=consent_id,
        status="PENDING",
        message="Consent request created successfully."
    )

# OCEN consent status endpoint
@app.get("/aa/consent-status/{consent_id}", response_model=ConsentStatusResponse)
def get_consent_status(consent_id: str):
    if consent_id not in consents:
        raise HTTPException(status_code=404, detail="Consent ID not found")
    
    consent = consents[consent_id]

    # Simulate consent approval after a delay or random selection
    if consent["status"] == "PENDING" and time.time() - consent["request_time"] > 5:  # Simulate some delay
        consent["status"] = random.choice(["APPROVED", "REJECTED"])

    # Consider expired consents (e.g., after 30 minutes)
    if time.time() - consent["request_time"] > 1800:  # 30 minutes expiration
        consent["status"] = "EXPIRED"

    return ConsentStatusResponse(
        consent_id=consent_id,
        status=consent["status"],
        message="Consent status updated successfully."
    )

# OCEN data fetch endpoint (for example, bank statement)
@app.get("/aa/fetch-data/{consent_id}", response_model=ConsentData)
def fetch_data(consent_id: str):
    if consent_id not in consents:
        raise HTTPException(status_code=404, detail="Consent ID not found")

    consent = consents[consent_id]

    if consent["status"] != "APPROVED":
        raise HTTPException(status_code=403, detail="Consent not approved")

    # Simulate the data fetching based on consented data types
    fetched_data = {}
    if "bank_statement" in consent["data_types"]:
        fetched_data["bank_statement"] = generate_random_bank_statement()
    
    return ConsentData(
        consent_id=consent_id,
        data=fetched_data
    )

# Simulate a realistic bank statement for testing
def generate_random_bank_statement():
    transactions = []
    for _ in range(random.randint(3, 6)):
        transactions.append({
            "date": f"2025-04-{random.randint(1, 30):02d}",
            "description": random.choice(["Sales Revenue", "Rent Payment", "Utility Bill", "Refund"]),
            "amount": random.randint(-5000, 30000),
        })
    closing_balance = sum(t["amount"] for t in transactions) + 10000  # start with an arbitrary balance
    return BankStatement(
        account_number=f"{random.randint(1000000000, 9999999999)}",
        bank_name="Mock Bank",
        transactions=transactions,
        closing_balance=closing_balance
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("aa.service:app", host="127.0.0.1", port=7000, reload=True)
