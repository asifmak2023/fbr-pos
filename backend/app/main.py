from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from .database import engine, Base
from .models import user  # <-- ADD THIS LINE (imports the User model)
from .routes import auth   # <-- must be present
from .routes import auth, products, sales   # <-- add 'products'



# Create the FastAPI app instance
app = FastAPI(title="FBR POS API", version="1.0")

app.include_router(auth.router)   # <-- must be present
app.include_router(products.router)
app.include_router(sales.router)   # <-- add this line


# Create database tables on startup
@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created (if they didn't exist)")

# Allow frontend to talk to backend (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# A simple test endpoint
@app.get("/")
def root():
    return {"message": "FBR POS Backend is running"}

# A health check endpoint
@app.get("/health")
def health():
    return {"status": "ok"}

# This runs the server when you execute this file directly
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)