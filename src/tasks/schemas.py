from pydantic import BaseModel


class TaskCreate(BaseModel):
    name: str
    contest_type: str
    contest_number: int
    task_number: int
    description: str