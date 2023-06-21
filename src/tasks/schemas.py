from pydantic import BaseModel


class TaskCreate(BaseModel):
    name: str
    contest_type: str
    contest_number: int
    task_number: str
    description: str
    taken_max: int
    dead_line: int
    task_value: float
