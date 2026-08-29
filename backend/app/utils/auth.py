from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt
import hashlib

# Password hashing - using argon2 for better compatibility
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def hash_password(password: str) -> str:
    try:
        return pwd_context.hash(password)
    except Exception:
        # Fallback to SHA256 if argon2 fails
        return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        # Fallback for SHA256 hash
        return hashlib.sha256(plain_password.encode()).hexdigest() == hashed_password

# JWT settings
SECRET_KEY = "fbr-pos-secret-key-2026-very-secure"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str):
    try:
        print(f"🔍 Decoding token: {token[:20]}...")  # <-- ADD THIS
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print(f"✅ Token decoded: {payload}")  # <-- ADD THIS
        return payload
    except jwt.JWTError as e:
        print(f"❌ JWT Error: {e}")  # <-- ADD THIS
        return None