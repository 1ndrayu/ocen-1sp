# OCEN 1SP – Loan Service Provider (LSP) MVP

A minimal implementation of a Loan Service Provider (LSP) aligned with the Open Credit Enablement Network (OCEN) protocol. This project demonstrates the core consent flow, data request, and loan application pipeline using a FastAPI backend.

---

Each directory contains the respective service's implementation, adhering to OCEN standards for API endpoints and data handling.

---

## Features

- **Consent Request**: Initiate data consent flows via the mock Account Aggregator (AA) service.
- **Consent Status Check**: Retrieve consent status using the consent ID.
- **Loan Application**: Submit loan applications via the mock Lender service after obtaining consent.
- **Modular Architecture**: Separate services for AA, Lender, and LSP, facilitating independent development and testing.

---

## Technologies Used

- **Backend**: FastAPI (Python)
- **API Standards**: OCEN-compliant endpoints for consent and loan application processes

---

## Running the Services

To run the services locally:

1. Clone the repository:
   git clone https://github.com/1ndrayu/ocen-1sp.git
   cd ocen-1sp

2. Navigate to each service directory (e.g., aa, lender, lsp) and install dependencies:
  cd aa
  pip install -r requirements.txt
  uvicorn main:app --reload

Repeat the above steps for the lender and lsp directories.

3. Ensure that the services are running on their respective ports:
  Account Aggregator (AA): http://localhost:7000
  Lender: http://localhost:8000
  Loan Service Provider (LSP): http://localhost:9000
---

Notes
- This is a local MVP for demonstration and experimentation.
- Asset verification, authentication, and real AA/Lender integrations are not in scope yet.
- Follow OCEN specifications when building real-world integrations.
---

## Contact
Developed by Indrayu Sandbhor
LinkedIn • GitHub

---
