from typing import Literal

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.orm import Session

from database import get_db
from routers.tasks import router as tasks_router


app = FastAPI(
    title="Task Pair Programming API",
    version="0.1.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(tasks_router)


class HealthResponse(BaseModel):
    status: Literal["healthy"]


@app.get("/health", response_model=HealthResponse, tags=["health"])
async def health_check() -> HealthResponse:
    """Report whether the API process is ready to receive requests."""
    return HealthResponse(status="healthy")


@app.get("/health/database", response_model=HealthResponse, tags=["health"])
def database_health_check(database: Session = Depends(get_db)) -> HealthResponse:
    """Verify that the API can communicate with PostgreSQL."""
    try:
        database.execute(text("SELECT 1"))
        return HealthResponse(status="healthy")
    except Exception as error:
        raise HTTPException(status_code=503, detail="Database unavailable") from error
