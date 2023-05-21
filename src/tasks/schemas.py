from pydantic import BaseModel


class TaskCreate(BaseModel):
    # id: int
    name: str
    contest_type: str
    contest_number: int
    description: str
    added_by: int
