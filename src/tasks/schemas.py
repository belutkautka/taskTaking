from pydantic import BaseModel
from typing import Optional

class TaskCreate(BaseModel):
    name: str
    task_type: str
    description: str
    taken_max: int
    dead_line: int
    task_value: int
    flag: str #
    file_link: str #


class TaskUpdate(BaseModel):
    task_id: int
    name: str
    description: str
    taken_max: int
    dead_line: int
    task_value: int
