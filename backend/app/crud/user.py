from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.utils.auth import get_password_hash, verify_password
from typing import Optional

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Get user by email"""
    return db.query(User).filter(User.email == email).first()

def get_user_by_username(db: Session, username: str) -> Optional[User]:
    """Get user by username"""
    return db.query(User).filter(User.username == username).first()

def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    """Get user by ID"""
    return db.query(User).filter(User.id == user_id).first()

def create_user(db: Session, user: UserCreate) -> User:
    """Create a new user"""
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        username=user.username,
        full_name=user.full_name,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, email_or_username: str, password: str):
    """Authenticate user by email or username"""
    # Try to find user by email first
    user = get_user_by_email(db, email=email_or_username)
    
    # If not found, try username
    if not user:
        user = get_user_by_username(db, username=email_or_username)
    
    if not user:
        return None
    
    if not verify_password(password, user.hashed_password):
        return None
    
    return user

def update_user(db: Session, user_id: int, user_update: UserUpdate) -> Optional[User]:
    """Update user information"""
    db_user = get_user_by_id(db, user_id)
    if not db_user:
        return None
    
    update_data = user_update.dict(exclude_unset=True) # convert model into dict only fields user sent
    for field, value in update_data.items():
        setattr(db_user, field, value) # update with new values
    
    db.commit()
    db.refresh(db_user)
    return db_user


def change_user_password(db: Session, user_id: int, old_password: str, new_password: str) -> bool:
    """Change the user's password if old_password matches."""
    db_user = get_user_by_id(db, user_id)
    if not db_user:
        return False

    # verify old password
    if not verify_password(old_password, db_user.hashed_password):
        return False

    # set new hashed password
    db_user.hashed_password = get_password_hash(new_password)
    db.commit()
    db.refresh(db_user)
    return True

def deactivate_user(db: Session, user_id: int) -> Optional[User]:
    """Deactivate a user"""
    db_user = get_user_by_id(db, user_id)
    if not db_user:
        return None
    
    db_user.is_active = False
    db.commit()
    db.refresh(db_user)
    return db_user