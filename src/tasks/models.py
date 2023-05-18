from datetime import datetime
from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTable
from sqlalchemy import Table, Column, Integer, String, TIMESTAMP, ForeignKey, Boolean, MetaData, Identity
from src.database import Base
from src.auth.models import user

metadata = MetaData()

task = Table(
    "task",
    metadata,
    Column("id", Integer, Identity(start=1, cycle=True), primary_key=True),
    Column("name", String, nullable=False),
    Column("contest_type", String, nullable=False),
    Column("contest_number", Integer, nullable=False),
    Column("description", String, nullable=False),
    Column("added_by", Integer, ForeignKey(user.c.id))
)
