from pydantic import BaseModel, ConfigDict, field_validator
from datetime import datetime, timezone
from typing import List, Optional

class DeleteTasksRequest(BaseModel):
    task_ids: List[int]


class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False
    remainded: bool = False
    reminder_time: Optional[datetime] = None

    @field_validator("reminder_time", mode="after")
    @classmethod
    def ensure_tz(cls, v: Optional[datetime]) -> Optional[datetime]:
        if v is not None and v.tzinfo is None:
            return v.replace(tzinfo=timezone.utc)
        return v

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    remainded: Optional[bool] = None
    reminder_time: Optional[datetime] = None

class Task(TaskBase):
    id: int
    user_id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    @field_validator("created_at", "updated_at", mode="after")
    @classmethod
    def ensure_tz_fields(cls, v: Optional[datetime]) -> Optional[datetime]:
        if v is not None and v.tzinfo is None:
            return v.replace(tzinfo=timezone.utc)
        return v

    model_config = ConfigDict(from_attributes=True)
