from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.database import Base

class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Foreign Keys
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    discussion_id = Column(Integer, ForeignKey("discussions.id"), nullable=False)

    # Relationships
    author = relationship("User", back_populates="comments")
    discussion = relationship("Discussion", back_populates="comments")