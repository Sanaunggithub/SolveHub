from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
from app.config import settings
import hashlib
import secrets
import base64

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against its hash"""
    try:
        # Extract salt and hash from stored password
        salt_b64, hash_b64 = hashed_password.split('$')
        salt = base64.b64decode(salt_b64)
        stored_hash = base64.b64decode(hash_b64)
        
        # Hash the plain password with the same salt
        password_hash = hashlib.pbkdf2_hmac('sha256', plain_password.encode('utf-8'), salt, 100000)
        
        # Compare hashes
        return secrets.compare_digest(password_hash, stored_hash)
    except Exception as e:
        return False

def get_password_hash(password: str) -> str:
    """Hash a password using PBKDF2 with SHA256"""
    # Generate a random salt
    salt = secrets.token_bytes(32)
    
    # Hash the password with the salt using PBKDF2
    password_hash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
    
    # Encode salt and hash in base64 and combine with separator
    salt_b64 = base64.b64encode(salt).decode('utf-8')
    hash_b64 = base64.b64encode(password_hash).decode('utf-8')
    
    return f"{salt_b64}${hash_b64}"

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def verify_token(token: str, credentials_exception):
    """Verify and decode a JWT token"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        return email
    except JWTError:
        raise credentials_exception