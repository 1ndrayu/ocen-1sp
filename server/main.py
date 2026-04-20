import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import aa, lender, lsp
import os

app = FastAPI(title="OCEN Unified API")

# Permissive CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"status": "online", "message": "OCEN Unified Backend"}

# Include Routers
app.include_router(aa.router, prefix="/api")
app.include_router(lender.router, prefix="/api")
app.include_router(lsp.router, prefix="/api")

if __name__ == "__main__":
    # Listening on 0.0.0.0 makes it reachable via any local interface
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
