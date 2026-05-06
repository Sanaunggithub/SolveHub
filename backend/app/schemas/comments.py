from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CommentAuthor(BaseModel):
    """Comment author information"""
    id: int
    full_name: str
    username: str

    class Config:
        from_attributes = True

class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    pass

class CommentUpdate(BaseModel):
    content: str

class CommentOut(BaseModel):
    id: int
    content: str
    user_id: int
    discussion_id: int
    author: Optional[CommentAuthor] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True