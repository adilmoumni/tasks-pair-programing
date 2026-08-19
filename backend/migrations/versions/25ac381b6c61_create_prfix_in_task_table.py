"""create prfix in task table

Revision ID: 25ac381b6c61
Revises: 20260819_0001
Create Date: 2026-08-19 15:30:02.252438
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = '25ac381b6c61'
down_revision: Union[str, Sequence[str], None] = '20260819_0001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # The temporary default allows existing rows to be migrated safely.
    op.add_column(
        "tasks",
        sa.Column(
            "prefix", sa.String(length=255), server_default="TASK", nullable=False
        ),
    )
    op.alter_column("tasks", "prefix", server_default=None)
    op.create_index(op.f("ix_tasks_prefix"), "tasks", ["prefix"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_tasks_prefix"), table_name="tasks")
    op.drop_column("tasks", "prefix")
