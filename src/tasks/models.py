from sqlalchemy import Table, Column, Integer, String, ForeignKey, MetaData, Identity, TIMESTAMP, Float, Boolean

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
    # Column("taken_by", ARRAY(Integer), nullable=True),
    # Column("taken_cnt", Integer), # calc
    Column("taken_max", Integer, nullable=True),
    Column("dead_line", TIMESTAMP, nullable=True),
    Column("task_value", Float, nullable=True),
    Column("is_available", Boolean, nullable=False)
)

taken_task = Table(
    "taken_task",
    metadata,
    Column("task_id", Integer, ForeignKey(task.c.id), primary_key=True),
    Column("user_id", Integer, ForeignKey(user.c.id), primary_key=True)
)