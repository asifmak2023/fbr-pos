import os
from typing import List

class Settings:
    # CORS Settings
    CORS_ORIGINS: List[str] = [
        "http://localhost:4200",
        "https://backend-test-e2056949.fastapicloud.dev",
        # Add your production frontend URL here when deployed
    ]
    
    # Allow overriding via environment variable (comma-separated)
    if os.getenv("CORS_ORIGINS"):
        CORS_ORIGINS = [origin.strip() for origin in os.getenv("CORS_ORIGINS").split(",")]
    
    # Add frontend URL if specified
    if os.getenv("FRONTEND_URL"):
        if os.getenv("FRONTEND_URL") not in CORS_ORIGINS:
            CORS_ORIGINS.append(os.getenv("FRONTEND_URL"))

settings = Settings()