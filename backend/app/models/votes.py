from sqlalchemy import Column, Integer, DateTime, ForeignKey, func, String
from sqlalchemy.orm import relationship
from app.database import Base

class Vote(Base):
    __tablename__ = "votes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    discussion_id = Column(Integer, ForeignKey("discussions.id"), nullable=False)
    vote_type = Column(String(20), nullable=False)  # Changed from Integer to String
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="votes")
    discussion = relationship("Discussion", back_populates="vote_records")