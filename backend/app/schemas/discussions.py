from pydantic import BaseModel, field_validator
from typing import List, Optional
from datetime import datetime
import json

class AuthorOut(BaseModel):
    """Author information for discussions"""
    id: int
    full_name: str
    username: str
    email: str

    class Config:
        from_attributes = True

class DiscussionBase(BaseModel):
    title: str
    content: str
    category: Optional[List[str]] = None
    tags: Optional[List[str]] = None

class DiscussionCreate(DiscussionBase):
    pass

class DiscussionUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    category: Optional[List[str]] = None
    tags: Optional[List[str]] = None

class DiscussionOut(BaseModel):
    id: int
    title: str
    content: str
    category: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    user_id: int
    author: Optional[AuthorOut] = None
    upvotes: int
    downvotes: int
    views: int
    comment_count: int = 0
    created_at: datetime
    updated_at: Optional[datetime] = None

    @field_validator('category', mode='before')
    @classmethod
    def parse_category(cls, v):
        """Convert JSON string to list"""
        if isinstance(v, str):
            try:
                return json.loads(v)
            except:
                return []
        return v if v else []

    @field_validator('tags', mode='before')
    @classmethod
    def parse_tags(cls, v):
        """Convert JSON string to list"""
        if isinstance(v, str):
            try:
                return json.loads(v)
            except:
                return []
        return v if v else []

    @field_validator('upvotes', mode='before')
    @classmethod
    def parse_upvotes(cls, v):
        """Convert None to 0"""
        return v if v is not None else 0

    @field_validator('downvotes', mode='before')
    @classmethod
    def parse_downvotes(cls, v):
        """Convert None to 0"""
        return v if v is not None else 0

    @field_validator('views', mode='before')
    @classmethod
    def parse_views(cls, v):
        """Convert None to 0"""
        return v if v is not None else 0

    class Config:
        from_attributes = True