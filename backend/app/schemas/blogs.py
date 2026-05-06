from pydantic import BaseModel, field_validator
from typing import List, Optional
from datetime import datetime
import json

class UserBasic(BaseModel):
    """Basic user info for blog author"""
    id: int
    full_name: str
    email: str

    class Config:
        from_attributes = True

class BlogBase(BaseModel):
    title: str
    content: str
    category: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    is_published: bool = False

class BlogCreate(BlogBase):
    pass

class BlogUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    category: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    is_published: Optional[bool] = None

class BlogOut(BaseModel):
    id: int
    title: str
    content: str
    category: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    user_id: int
    author: Optional[UserBasic] = None
    is_published: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    # before means run this function before Pydantic tries to 
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

    class Config:
        from_attributes = True
