from __future__ import annotations
from typing import List, TYPE_CHECKING
from sqlalchemy import String, Boolean, ForeignKey, Text, DateTime, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime

from .base import BaseModel

if TYPE_CHECKING:
    from .user import User

class Task(BaseModel):
    __tablename__ = "tasks"

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    completed: Mapped[bool] = mapped_column(Boolean, default=False)
    reminder_time: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    user: Mapped["User"] = relationship(back_populates="tasks")
    
    comments: Mapped[List["Comment"]] = relationship(back_populates="task", cascade="all, delete-orphan")

class Comment(BaseModel):
    __tablename__ = "comments"
    __table_args__ = (
        Index("ix_comments_task_id", "task_id"),
    )

    content: Mapped[str] = mapped_column(Text, nullable=False)
    
    task_id: Mapped[int] = mapped_column(ForeignKey("tasks.id"), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    task: Mapped["Task"] = relationship(back_populates="comments")
    user: Mapped["User"] = relationship(back_populates="comments")
