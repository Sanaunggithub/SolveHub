from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app import crud, schemas
from app.database import get_db
from app.dependencies import get_current_user

router = APIRouter(prefix="/blogs", tags=["Blogs"])

@router.post("/", response_model=schemas.BlogOut, status_code=status.HTTP_201_CREATED)
def create_blog(
    blog: schemas.BlogCreate, 
    db: Session = Depends(get_db), 
    current_user = Depends(get_current_user)
):
    """Create a new blog (requires authentication)"""
    return crud.create_blog(db, blog, user_id=current_user.id)

@router.get("/", response_model=List[schemas.BlogOut])
def get_blogs(db: Session = Depends(get_db), skip: int = 0, limit: int = 20, published_only: bool = True):
    """Get all published blogs with pagination"""
    return crud.get_all_blogs(db, skip=skip, limit=limit, published_only=published_only)

@router.get("/{blog_id}", response_model=schemas.BlogOut)
def get_blog(blog_id: int, db: Session = Depends(get_db)):
    """Get a single blog by ID"""
    blog = crud.get_blog(db, blog_id)
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return blog

@router.put("/{blog_id}", response_model=schemas.BlogOut)
def update_blog(
    blog_id: int, 
    update_data: schemas.BlogUpdate, 
    db: Session = Depends(get_db), 
    current_user = Depends(get_current_user)
):
    """Update a blog (only by the author)"""
    updated = crud.update_blog(db, blog_id, update_data, user_id=current_user.id)
    if not updated:
        raise HTTPException(status_code=403, detail="Not authorized or blog not found")
    return updated

@router.delete("/{blog_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_blog(
    blog_id: int, 
    db: Session = Depends(get_db), 
    current_user = Depends(get_current_user)
):
    """Delete a blog (only by the author)"""
    success = crud.delete_blog(db, blog_id, user_id=current_user.id)
    if not success:
        raise HTTPException(status_code=403, detail="Not authorized or blog not found")
    return None

@router.get("/user/{user_id}", response_model=List[schemas.BlogOut])
def get_user_blogs(
    user_id: int, 
    db: Session = Depends(get_db), 
    skip: int = 0, 
    limit: int = 20,
    published_only: bool = True
):
    """Get all blogs by a specific user"""
    return crud.get_user_blogs(db, user_id=user_id, skip=skip, limit=limit, published_only=published_only)

@router.get("/search/{query_str}", response_model=List[schemas.BlogOut])
def search_blogs(
    query_str: str, 
    db: Session = Depends(get_db), 
    skip: int = 0, 
    limit: int = 20,
    published_only: bool = True
):
    """Search blogs by title or content"""
    return crud.search_blogs(db, query_str=query_str, skip=skip, limit=limit, published_only=published_only)

@router.post("/{blog_id}/publish", response_model=schemas.BlogOut)
def publish_blog(
    blog_id: int, 
    db: Session = Depends(get_db), 
    current_user = Depends(get_current_user)
):
    """Publish a blog (only by the author)"""
    blog = crud.publish_blog(db, blog_id, user_id=current_user.id)
    if not blog:
        raise HTTPException(status_code=403, detail="Not authorized or blog not found")
    return blog

@router.post("/{blog_id}/unpublish", response_model=schemas.BlogOut)
def unpublish_blog(
    blog_id: int, 
    db: Session = Depends(get_db), 
    current_user = Depends(get_current_user)
):
    """Unpublish a blog (only by the author)"""
    blog = crud.unpublish_blog(db, blog_id, user_id=current_user.id)
    if not blog:
        raise HTTPException(status_code=403, detail="Not authorized or blog not found")
    return blog
