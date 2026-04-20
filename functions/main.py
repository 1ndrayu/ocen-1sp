from firebase_functions import https_fn
from firebase_admin import initialize_app
import aa
import lender
import lsp

initialize_app()

@https_fn.on_request(region="asia-south1")
def aa_svc(req: https_fn.Request) -> https_fn.Response:
    from asgiref.wsgi import ASGIMiddleware
    import uvicorn
    # Using a helper to bridge FastAPI to Cloud Functions
    # For Python 3.10+, we can use the following pattern
    return handle_fastapi(aa.app, req)

@https_fn.on_request(region="asia-south1")
def lender_svc(req: https_fn.Request) -> https_fn.Response:
    return handle_fastapi(lender.app, req)

@https_fn.on_request(region="asia-south1")
def lsp_svc(req: https_fn.Request) -> https_fn.Response:
    return handle_fastapi(lsp.app, req)

def handle_fastapi(app, req):
    # This is a simplified wrapper. For production, consider 'mangum' or similar
    # However, for Firebase Functions Python, we can use the built-in request handling
    # We'll use a direct call if possible or a lightweight bridge
    from fastapi.testclient import TestClient
    client = TestClient(app)
    
    # Map method
    method = req.method
    path = req.path
    if req.query_string:
        path += "?" + req.query_string.decode()
    
    headers = dict(req.headers)
    body = req.get_data()
    
    response = client.request(
        method=method,
        url=path,
        headers=headers,
        content=body
    )
    
    return https_fn.Response(
        response.content,
        status=response.status_code,
        headers=dict(response.headers)
    )
