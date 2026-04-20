from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import aa, lender, lsp
import uvicorn

app = FastAPI(
    title="OCEN Unified API",
    description="Integrated AA, Lender, and LSP services",
    version="1.0.0"
)

# Configure CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For demo, allow all. In prod, restrict to your domain.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the modular routers
app.include_router(aa.router, prefix="/api")
app.include_router(lender.router, prefix="/api")
app.include_router(lsp.router, prefix="/api")

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "OCEN Unified API is running",
        "aesthetic": "Google Minimalist"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
