# OCEN 1SP – Loan Service Provider MVP

A minimal but functional Loan Service Provider (LSP) interface aligned with the OCEN (Open Credit Enablement Network) protocol. This MVP demonstrates the core consent flow, data request, and loan application pipeline using a simple React frontend and FastAPI backend.

---

## Features

- **Consent Request** – Trigger data consent flows via mock Account Aggregator (AA) endpoints.
- **Consent Status Check** – Poll consent status using consent ID.
- **Loan Application** – Apply for micro-credit via a mock Lender API after consent.
- **Live Feedback** – See real-time responses for all actions.

---

## Tech Stack

**Frontend**  
- React (Functional Components + Hooks)  
- Axios (HTTP Client)  
- Bootstrap (UI Styling)

**Backend (separate repo or service)**  
- FastAPI (Python)  
- OCEN-standardized routes (`/aa/consent-request`, `/aa/consent-status`, `/lender/apply`)

---

## Running the Frontend

# Clone the repo
git clone https://github.com/1ndrayu/ocean-1sp.git
cd ocean-1sp/mvp-ui

# Install dependencies
npm install

# Start development server
npm start
