from sqlalchemy import select
from sqlalchemy.orm import Session

from models import Task
from schemas import TaskCreate, TaskUpdate


def list_tasks(database: Session) -> list[Task]:
    statement = select(Task).order_by(Task.id)
    return list(database.scalars(statement).all())


def create_task(database: Session, task_data: TaskCreate) -> Task:
    task = Task(**task_data.model_dump())
    database.add(task)
    database.commit()
    database.refresh(task)
    return task


def get_task(database: Session, task_id: int) -> Task | None:
    return database.get(Task, task_id)


def update_task(database: Session, task: Task, task_data: TaskUpdate) -> Task:
    for field, value in task_data.model_dump(exclude_unset=True).items():
        setattr(task, field, value)

    database.commit()
    database.refresh(task)
    return task


def delete_task(database: Session, task: Task) -> None:
    database.delete(task)
    database.commit()
