from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field, field_validator


class TaskStatus(StrEnum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    DONE = "done"


class TaskCreate(BaseModel):
    prefix: str = Field(min_length=1, max_length=255)
    name: str = Field(min_length=1, max_length=255)
    description: str | None = None
    status: TaskStatus = TaskStatus.TODO


class TaskUpdate(BaseModel):
    prefix: str | None = Field(default=None, min_length=1, max_length=255)
    name: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = None
    status: TaskStatus | None = None

    @field_validator("prefix", "name", "status")
    @classmethod
    def prevent_null_required_fields(cls, value: object) -> object:
        if value is None:
            raise ValueError("Field cannot be null")
        return value


class TaskResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    prefix: str
    name: str
    description: str | None
    status: TaskStatus
    created_at: datetime
    updated_at: datetime
