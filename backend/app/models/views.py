# app/models/views.py

from sqlalchemy import Column, Integer, ForeignKey, DateTime, UniqueConstraint, func
from app.database import Base

class DiscussionView(Base):
    __tablename__ = "discussion_views"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    discussion_id = Column(Integer, ForeignKey("discussions.id"), nullable=False)
    viewed_at = Column(DateTime(timezone=True), server_default=func.now())

    # A user can only have ONE view record per discussion
    __table_args__ = (
        UniqueConstraint("user_id", "discussion_id", name="unique_user_discussion_view"),
    )
