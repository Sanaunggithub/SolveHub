from sqlalchemy.orm import Session
from app.models.comments import Comment
from app.schemas.comments import CommentCreate, CommentUpdate
from typing import List, Optional

def create_comment(db: Session, comment: CommentCreate, user_id: int, discussion_id: int) -> Comment:
    """Create a new comment"""
    db_comment = Comment(
        content=comment.content,
        user_id=user_id,
        discussion_id=discussion_id
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

def get_comment(db: Session, comment_id: int) -> Optional[Comment]:
    """Get a single comment by ID"""
    return db.query(Comment).filter(Comment.id == comment_id).first()

def get_discussion_comments(db: Session, discussion_id: int) -> List[Comment]:
    """Get all comments for a discussion"""
    return db.query(Comment).filter(Comment.discussion_id == discussion_id)\
        .order_by(Comment.created_at.asc()).all()

def update_comment(db: Session, comment_id: int, comment_update: CommentUpdate, user_id: int) -> Optional[Comment]:
    """Update a comment (only by the author)"""
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    
    if not comment or comment.user_id != user_id:
        return None
    
    comment.content = comment_update.content
    db.commit()
    db.refresh(comment)
    return comment

def delete_comment(db: Session, comment_id: int, user_id: int) -> bool:
    """Delete a comment (only by the author)"""
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    
    if not comment or comment.user_id != user_id:
        return False
    
    db.delete(comment)
    db.commit()
    return True