from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from uuid import uuid4
from typing import List
import httpx

app = FastAPI(title="Loan Service Provider")

# Endpoint to request consent from AA
@app.post("/aa/consent-request")
async def consent_request(user_id: str, data_types: List[str]):
    consent_id = str(uuid4())
    # Simulating consent request
    consent_status = await check_consent_status(consent_id)
    return {"consent_id": consent_id, "status": consent_status["status"]}

# Check consent status from AA
@app.get("/aa/consent-status/{consent_id}")
async def consent_status(consent_id: str):
    consent = await check_consent_status(consent_id)
    if consent["status"] == "APPROVED":
        return {"consent_id": consent_id, "status": "APPROVED"}
    else:
        raise HTTPException(status_code=403, detail="Consent not approved")

# Simulate consent status check
async def check_consent_status(consent_id: str):
    async with httpx.AsyncClient() as client:
        # Actually call the mock AA service
        try:
            response = await client.get(f"http://localhost:7000/aa/consent-status/{consent_id}")
            return response.json()
        except Exception:
            # Fallback for when AA is not running
            return {"consent_id": consent_id, "status": "APPROVED" if uuid4().int % 2 == 0 else "REJECTED"}

# Endpoint to submit loan application to the lender
@app.post("/loan/apply")
async def apply_loan(request: dict):
    # Generate new application ID and consent ID
    application_id = str(uuid4())
    
    # Simulate sending loan application to lender
    # We pass the application_id in the request as the lender expects it
    request["application_id"] = application_id
    lender_response = await send_loan_application_to_lender(request)
    return {"application_id": application_id, "status": lender_response}

# Simulate sending loan application to lender
async def send_loan_application_to_lender(request: dict):
    async with httpx.AsyncClient() as client:
        # Lender service runs on port 8000
        lender_response = await client.post("http://localhost:8000/lender/apply", json=request)
        return lender_response.json()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=9000)
