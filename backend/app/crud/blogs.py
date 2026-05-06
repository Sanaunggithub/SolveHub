from sqlalchemy.orm import Session
from app.models.blogs import Blog
from app.schemas.blogs import BlogCreate, BlogUpdate
from typing import List, Optional
import json

def create_blog(db: Session, blog: BlogCreate, user_id: int) -> Blog:
    """Create a new blog"""
    db_blog = Blog(
        title=blog.title,
        content=blog.content,
        is_published=blog.is_published,
        user_id=user_id
    )
    db_blog.set_category(blog.category)
    db_blog.set_tags(blog.tags)

    db.add(db_blog)
    db.commit()
    db.refresh(db_blog)
    return db_blog

def get_blog(db: Session, blog_id: int) -> Optional[Blog]:
    """Get a single blog by ID"""
    blog = db.query(Blog).filter(Blog.id == blog_id).first()
    return blog

def get_all_blogs(db: Session, skip: int = 0, limit: int = 20, published_only: bool = True) -> List[Blog]:
    """Get all blogs with pagination"""
    query = db.query(Blog)
    if published_only:
        query = query.filter(Blog.is_published == True)
    return query.order_by(Blog.created_at.desc()).offset(skip).limit(limit).all()

def update_blog(db: Session, blog_id: int, update_data: BlogUpdate, user_id: int) -> Optional[Blog]:
    """Update a blog (only by the author)"""
    blog = db.query(Blog).filter(Blog.id == blog_id).first()
    
    if not blog or blog.user_id != user_id:
        return None
    
    update_dict = update_data.dict(exclude_unset=True)

    # check category and tags are list,if so converts them into JSON strings so they can be safely stored in the database
    if "category" in update_dict and isinstance(update_dict["category"], list):
        update_dict["category"] = json.dumps(update_dict["category"])
    if "tags" in update_dict and isinstance(update_dict["tags"], list):
        update_dict["tags"] = json.dumps(update_dict["tags"])

    for key, value in update_dict.items():
        setattr(blog, key, value) #setattribute
    
    db.commit()
    db.refresh(blog)
    return blog

def delete_blog(db: Session, blog_id: int, user_id: int) -> bool:
    """Delete a blog (only by the author)"""
    blog = db.query(Blog).filter(Blog.id == blog_id).first()
    
    if not blog or blog.user_id != user_id:
        return False
    
    db.delete(blog)
    db.commit()
    return True

def get_user_blogs(db: Session, user_id: int, skip: int = 0, limit: int = 20, published_only: bool = True) -> List[Blog]:
    """Get all blogs by a specific user"""
    query = db.query(Blog).filter(Blog.user_id == user_id)
    if published_only:
        query = query.filter(Blog.is_published == True)
    return query.order_by(Blog.created_at.desc()).offset(skip).limit(limit).all()

def search_blogs(db: Session, query_str: str, skip: int = 0, limit: int = 20, published_only: bool = True) -> List[Blog]:
    """Search blogs by title or content"""
    search = f"%{query_str}%"
    query = db.query(Blog).filter(
        (Blog.title.like(search)) | (Blog.content.like(search))
    )
    if published_only:
        query = query.filter(Blog.is_published == True)
    return query.order_by(Blog.created_at.desc()).offset(skip).limit(limit).all()

def publish_blog(db: Session, blog_id: int, user_id: int) -> Optional[Blog]:
    """Publish a blog (only by the author)"""
    blog = db.query(Blog).filter(Blog.id == blog_id).first()
    
    if not blog or blog.user_id != user_id:
        return None
    
    blog.is_published = True
    db.commit()
    db.refresh(blog)
    return blog

def unpublish_blog(db: Session, blog_id: int, user_id: int) -> Optional[Blog]:
    """Unpublish a blog (only by the author)"""
    blog = db.query(Blog).filter(Blog.id == blog_id).first()
    
    if not blog or blog.user_id != user_id:
        return None
    
    blog.is_published = False
    db.commit()
    db.refresh(blog)
    return blog
