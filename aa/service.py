from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from uuid import uuid4
from typing import List
import random
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Mock Account Aggregator Service")

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

# In-memory store for consents
consents = {}

class ConsentRequest(BaseModel):
    user_id: str
    data_types: List[str]  # e.g., ["bank_statement"]

@app.post("/aa/consent-request")
def create_consent(req: ConsentRequest):
    consent_id = f"consent_{uuid4().hex[:8]}"
    consents[consent_id] = {
        "user_id": req.user_id,
        "data_types": req.data_types,
        "status": "PENDING"
    }
    return {"consent_id": consent_id, "status": "PENDING"}


@app.get("/aa/consent-status/{consent_id}")
def get_consent_status(consent_id: str):
    if consent_id not in consents:
        raise HTTPException(status_code=404, detail="Consent ID not found")
    
    # Simulate consent approval after some time
    if consents[consent_id]["status"] == "PENDING":
        consents[consent_id]["status"] = random.choice(["APPROVED", "REJECTED"])
    
    return {
        "consent_id": consent_id,
        "status": consents[consent_id]["status"]
    }


@app.get("/aa/fetch-data/{consent_id}")
def fetch_data(consent_id: str):
    if consent_id not in consents:
        raise HTTPException(status_code=404, detail="Consent ID not found")

    if consents[consent_id]["status"] != "APPROVED":
        raise HTTPException(status_code=403, detail="Consent not approved")

    # Simulate mock bank data
    return {
        "consent_id": consent_id,
        "bank_statement": {
            "account_number": "1234567890",
            "bank_name": "Mock Bank",
            "transactions": [
                {"date": "2025-04-01", "description": "Sales Revenue", "amount": 30000},
                {"date": "2025-04-03", "description": "Rent Payment", "amount": -5000},
                {"date": "2025-04-05", "description": "Utility Bill", "amount": -2000},
            ],
            "closing_balance": 23000
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=7000)
