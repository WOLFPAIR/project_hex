"""Add index for comments.task_id.

Revision ID: 20260122_add_comments_taskid
Revises: 20260122_initial_schema
Create Date: 2026-01-22
"""

from alembic import op

# revision identifiers, used by Alembic.
revision = "20260122_add_comments_taskid"
down_revision = "20260122_initial_schema"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Index is created in initial schema migration
    pass


def downgrade() -> None:
    # No-op: index lives in initial schema migration
    pass
