from sqlalchemy.orm import Session
from app.models.discussions import Discussion
from app.schemas.discussions import DiscussionCreate, DiscussionUpdate
from typing import List, Optional
from app.models.views import DiscussionView
from sqlalchemy.exc import IntegrityError
import json

def create_discussion(db: Session, discussion: DiscussionCreate, user_id: int) -> Discussion:
    """Create a new discussion"""
    db_discussion = Discussion(
        title=discussion.title,
        content=discussion.content,
        user_id=user_id
    )
    db_discussion.set_category(discussion.category)
    db_discussion.set_tags(discussion.tags)

    db.add(db_discussion)
    db.commit()
    db.refresh(db_discussion)
    return db_discussion

def get_discussion(db: Session, discussion_id: int, user_id: Optional[int] = None) -> Optional[Discussion]:
    """Get a single discussion by ID and track unique views"""
    discussion = db.query(Discussion).filter(Discussion.id == discussion_id).first()
    if not discussion:
        return None
    
    print(f"DEBUG CRUD: Discussion {discussion_id} current views: {discussion.views}")
    print(f"DEBUG CRUD: User ID: {user_id}")
    
    # Track view only if user is provided
    if user_id:
        # Check if this user has already viewed this discussion
        already_viewed = db.query(DiscussionView).filter_by(
            user_id=user_id,
            discussion_id=discussion_id
        ).first()

        print(f"DEBUG CRUD: Already viewed: {already_viewed is not None}")

        if not already_viewed:
            # Add new view record
            try:
                new_view = DiscussionView(user_id=user_id, discussion_id=discussion_id)
                db.add(new_view)
                db.flush()  # Flush to database before counting
                
                print(f"DEBUG CRUD: New view record created")
                
                # Update the view count to match actual unique views
                unique_views = db.query(DiscussionView).filter(
                    DiscussionView.discussion_id == discussion_id
                ).count()
                
                print(f"DEBUG CRUD: Unique views count: {unique_views}")
                
                discussion.views = unique_views
                db.commit()
                db.refresh(discussion)
                
                print(f"DEBUG CRUD: Updated discussion views to: {discussion.views}")
            except IntegrityError as e:
                # Handle race condition if view was added simultaneously
                print(f"DEBUG CRUD: IntegrityError: {e}")
                db.rollback()
                db.refresh(discussion)
            except Exception as e:
                print(f"DEBUG CRUD: Error: {e}")
                db.rollback()
                db.refresh(discussion)
    else:
        print(f"DEBUG CRUD: No user_id provided, skipping view tracking")

    return discussion

def get_all_discussions(db: Session, skip: int = 0, limit: int = 20) -> List[Discussion]:
    """Get all discussions with pagination"""
    return db.query(Discussion).order_by(Discussion.created_at.desc()).offset(skip).limit(limit).all()

def update_discussion(db: Session, discussion_id: int, update_data: DiscussionUpdate, user_id: int) -> Optional[Discussion]:
    """Update a discussion (only by the author)"""
    discussion = db.query(Discussion).filter(Discussion.id == discussion_id).first()
    
    if not discussion or discussion.user_id != user_id:
        return None
    
    update_dict = update_data.dict(exclude_unset=True)

    if "category" in update_dict and isinstance(update_dict["category"], list):
        update_dict["category"] = json.dumps(update_dict["category"])
    if "tags" in update_dict and isinstance(update_dict["tags"], list):
        update_dict["tags"] = json.dumps(update_dict["tags"])

    for key, value in update_dict.items():
        setattr(discussion, key, value) # update discussion with new values
    
    db.commit()
    db.refresh(discussion)
    return discussion

def delete_discussion(db: Session, discussion_id: int, user_id: int) -> bool:
    """Delete a discussion (only by the author)"""
    discussion = db.query(Discussion).filter(Discussion.id == discussion_id).first()
    
    if not discussion or discussion.user_id != user_id:
        return False
    try:
        # Delete dependent records that have foreign key constraints
        
        from app.models.views import DiscussionView
        from app.models.votes import Vote
        from app.models.comments import Comment

        # Remove discussion views, votes and comments before deleting the discussion
        db.query(DiscussionView).filter(DiscussionView.discussion_id == discussion_id).delete(synchronize_session=False)
        db.query(Vote).filter(Vote.discussion_id == discussion_id).delete(synchronize_session=False)
        db.query(Comment).filter(Comment.discussion_id == discussion_id).delete(synchronize_session=False)

        db.delete(discussion)
        db.commit()
        return True
    except Exception as e:
        db.rollback()
        print(f"Error deleting discussion {discussion_id}: {e}")
        return False

def get_user_discussions(db: Session, user_id: int, skip: int = 0, limit: int = 20) -> List[Discussion]:
    """Get all discussions by a specific user"""
    return db.query(Discussion).filter(Discussion.user_id == user_id).order_by(Discussion.created_at.desc()).offset(skip).limit(limit).all()

def search_discussions(db: Session, query: str, skip: int = 0, limit: int = 20) -> List[Discussion]:
    """Search discussions by title first, then by content if no results"""
    search = f"%{query}%"

    # Try searching in title first
    title_matches = db.query(Discussion).filter(Discussion.title.ilike(search)) \
        .order_by(Discussion.created_at.desc()) \
        .offset(skip).limit(limit).all()

    if title_matches:
        return title_matches

    # If none in title, search content
    content_matches = db.query(Discussion).filter(Discussion.content.ilike(search)) \
        .order_by(Discussion.created_at.desc()) \
        .offset(skip).limit(limit).all()

    return content_matches