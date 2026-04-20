from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from uuid import uuid4
from typing import List
import random
from firebase_admin import firestore

app = FastAPI()
db = firestore.client()

class ConsentRequest(BaseModel):
    user_id: str
    data_types: List[str]

@app.post("/consent-request")
def create_consent(req: ConsentRequest):
    consent_id = f"consent_{uuid4().hex[:8]}"
    consent_data = {
        "user_id": req.user_id,
        "data_types": req.data_types,
        "status": "PENDING"
    }
    db.collection("consents").document(consent_id).set(consent_data)
    return {"consent_id": consent_id, "status": "PENDING"}

@app.get("/consent-status/{consent_id}")
def get_consent_status(consent_id: str):
    doc_ref = db.collection("consents").document(consent_id)
    doc = doc_ref.get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Consent ID not found")
    
    data = doc.to_dict()
    if data["status"] == "PENDING":
        new_status = random.choice(["APPROVED", "REJECTED"])
        doc_ref.update({"status": new_status})
        return {"consent_id": consent_id, "status": new_status}
    
    return {"consent_id": consent_id, "status": data["status"]}

@app.get("/fetch-data/{consent_id}")
def fetch_data(consent_id: str):
    doc = db.collection("consents").document(consent_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Consent ID not found")

    data = doc.to_dict()
    if data["status"] != "APPROVED":
        raise HTTPException(status_code=403, detail="Consent not approved")

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
