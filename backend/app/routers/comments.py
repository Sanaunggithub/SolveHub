from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app import schemas
from app.database import get_db
from app.dependencies import get_current_user
from app.crud import comments as comment_crud

router = APIRouter(prefix="/comments", tags=["Comments"])

@router.post("/discussions/{discussion_id}", response_model=schemas.CommentOut, status_code=status.HTTP_201_CREATED)
def create_comment(
    discussion_id: int,
    comment: schemas.CommentCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Create a new comment on a discussion"""
    return comment_crud.create_comment(db, comment, user_id=current_user.id, discussion_id=discussion_id)

@router.get("/discussions/{discussion_id}", response_model=List[schemas.CommentOut])
def get_discussion_comments(
    discussion_id: int,
    db: Session = Depends(get_db)
):
    """Get all comments for a discussion"""
    return comment_crud.get_discussion_comments(db, discussion_id)

@router.put("/{comment_id}", response_model=schemas.CommentOut)
def update_comment(
    comment_id: int,
    comment_update: schemas.CommentUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Update a comment (only by the author)"""
    updated = comment_crud.update_comment(db, comment_id, comment_update, user_id=current_user.id)
    if not updated:
        raise HTTPException(status_code=403, detail="Not authorized or comment not found")
    return updated

@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Delete a comment (only by the author)"""
    success = comment_crud.delete_comment(db, comment_id, user_id=current_user.id)
    if not success:
        raise HTTPException(status_code=403, detail="Not authorized or comment not found")
    return None