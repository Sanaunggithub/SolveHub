from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.schemas.user import UserResponse, UserUpdate
from app.crud.user import get_user_by_id, update_user, deactivate_user
from app.crud.user import change_user_password
from app.schemas.user import ChangePassword
from app.dependencies import get_current_active_user
from app.models.user import User
from app.models.discussions import Discussion

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/statistics/all")
def get_all_members_statistics(db: Session = Depends(get_db)):
    """Get all members with their activity statistics"""
    members = db.query(User).filter(User.is_active == True).all()
    
    members_data = []
    for member in members:
        discussion_count = db.query(func.count(Discussion.id)).filter(
            Discussion.user_id == member.id
        ).scalar()
        
        total_votes = db.query(func.sum(Discussion.upvotes)).filter(
            Discussion.user_id == member.id
        ).scalar() or 0
        
        total_views = db.query(func.sum(Discussion.views)).filter(
            Discussion.user_id == member.id
        ).scalar() or 0
        
        members_data.append({
            "id": member.id,
            "username": member.username,
            "name": member.full_name,
            "email": member.email,
            "post_count": discussion_count,
            "posts": discussion_count,
            "votes": total_votes,
            "views": total_views,
            "joined": member.created_at,
            "status": "Active" if member.is_active else "Inactive"
        })
    
    # Sort by posts count in descending order
    members_data.sort(key=lambda x: x["posts"], reverse=True)
    
    return members_data

@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_active_user)):
    """Get current user profile"""
    return current_user

@router.put("/me", response_model=UserResponse)
def update_user_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update current user profile"""
    updated_user = update_user(db=db, user_id=current_user.id, user_update=user_update)
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return updated_user

@router.delete("/me", response_model=UserResponse)
def deactivate_user_account(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Deactivate current user account"""
    deactivated_user = deactivate_user(db=db, user_id=current_user.id)
    if not deactivated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return deactivated_user


@router.post("/me/change-password")
def change_password(
    payload: ChangePassword,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Change current user's password"""
    # basic validation
    if payload.new_password != payload.confirm_password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="New password and confirmation do not match")

    success = change_user_password(db=db, user_id=current_user.id, old_password=payload.old_password, new_password=payload.new_password)
    if not success:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Old password is incorrect or user not found")
    return {"message": "Password changed successfully"}