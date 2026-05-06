from sqlalchemy.orm import Session
from app.models.votes import Vote
from app.models.discussions import Discussion

def get_user_vote(db: Session, user_id: int, discussion_id: int):
    """Get user's vote on a discussion"""
    return db.query(Vote).filter(
        Vote.user_id == user_id,
        Vote.discussion_id == discussion_id
    ).first()

def create_vote(db: Session, user_id: int, discussion_id: int, vote_type: str):
    """Create a new vote"""
    vote = Vote(
        user_id=user_id,
        discussion_id=discussion_id,
        vote_type=vote_type
    )
    db.add(vote)
    
    # Update discussion vote count
    discussion = db.query(Discussion).filter(Discussion.id == discussion_id).first()
    if discussion:
        if vote_type == "upvote":
            discussion.upvotes += 1
        elif vote_type == "downvote":
            discussion.downvotes += 1
    
    db.commit()
    db.refresh(vote)
    return vote

def update_vote(db: Session, vote: Vote, new_vote_type: str):
    """Update existing vote - switch from upvote to downvote or vice versa"""
    old_vote_type = vote.vote_type
    vote.vote_type = new_vote_type
    
    # Update discussion vote count
    discussion = db.query(Discussion).filter(Discussion.id == vote.discussion_id).first()
    if discussion:
        # Remove old vote count
        if old_vote_type == "upvote":
            discussion.upvotes -= 1
        elif old_vote_type == "downvote":
            discussion.downvotes -= 1
        
        # Add new vote count
        if new_vote_type == "upvote":
            discussion.upvotes += 1
        elif new_vote_type == "downvote":
            discussion.downvotes += 1
    
    db.commit()
    db.refresh(vote)
    return vote

def delete_vote(db: Session, vote: Vote):
    """Delete a vote"""
    # Update discussion vote count
    discussion = db.query(Discussion).filter(Discussion.id == vote.discussion_id).first()
    if discussion:
        if vote.vote_type == "upvote":
            discussion.upvotes -= 1
        elif vote.vote_type == "downvote":
            discussion.downvotes -= 1
    
    db.delete(vote)
    db.commit()