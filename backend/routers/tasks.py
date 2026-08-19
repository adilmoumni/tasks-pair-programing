from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from database import get_db
from schemas import TaskCreate, TaskResponse, TaskUpdate
from services import tasks as task_service


router = APIRouter(prefix="/tasks", tags=["tasks"])
Database = Annotated[Session, Depends(get_db)]


@router.get("", response_model=list[TaskResponse])
def list_tasks(database: Database) -> list[TaskResponse]:
    return task_service.list_tasks(database)


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(task_data: TaskCreate, database: Database) -> TaskResponse:
    return task_service.create_task(database, task_data)


@router.patch("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int, task_data: TaskUpdate, database: Database
) -> TaskResponse:
    task = task_service.get_task(database, task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task_service.update_task(database, task, task_data)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, database: Database) -> Response:
    task = task_service.get_task(database, task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    task_service.delete_task(database, task)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
