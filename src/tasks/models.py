from sqlalchemy import Table, Column, Integer, String, ForeignKey, MetaData, Identity

from src.auth.models import user

metadata = MetaData()

task = Table(
    "task",
    metadata,
    Column("id", Integer, Identity(start=1, always=True), primary_key=True),
    Column("name", String, nullable=False),
    Column("contest_type", String, nullable=False),
    Column("contest_number", Integer, nullable=False),
    Column("task_number", Integer, nullable=False),
    Column("description", String, nullable=False),
    Column("added_by", Integer, ForeignKey(user.c.id), nullable=False),
    Column("taken_by", Integer, ForeignKey(user.c.id), nullable=True),
)
