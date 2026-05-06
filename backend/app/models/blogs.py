from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, func, Boolean
from sqlalchemy.orm import relationship
from app.database import Base
import json

class Blog(Base):
    __tablename__ = "blogs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    category = Column(String(255), nullable=True)  # Store as JSON string
    tags = Column(String(255), nullable=True)      # Store as JSON string
    is_published = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    author = relationship("User", back_populates="blogs")

    def set_category(self, category_list):
        """Convert list to JSON string"""
        if category_list:
            self.category = json.dumps(category_list)
        else:
            self.category = None

    def get_category(self):
        """Convert JSON string back to list"""
        if self.category:
            try:
                return json.loads(self.category)
            except:
                return []
        return []

    def set_tags(self, tags_list):
        """Convert list to JSON string"""
        if tags_list:
            self.tags = json.dumps(tags_list)
        else:
            self.tags = None

    def get_tags(self):
        """Convert JSON string back to list"""
        if self.tags:
            try:
                return json.loads(self.tags)
            except:
                return []
        return []
