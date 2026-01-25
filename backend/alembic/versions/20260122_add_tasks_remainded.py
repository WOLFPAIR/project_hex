"""Add remainded flag to tasks.

Revision ID: 20260122_add_tasks_remainded
Revises: 20260122_add_comments_taskid
Create Date: 2026-01-22
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "20260122_add_tasks_remainded"
down_revision = "20260122_add_comments_taskid"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "tasks",
        sa.Column("remainded", sa.Boolean(), nullable=False, server_default=sa.text("false")),
    )


def downgrade() -> None:
    op.drop_column("tasks", "remainded")
