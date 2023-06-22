from typing import Optional
from fastapi_users import schemas


class UserRead(schemas.BaseUser[int]):
    id: int
    email: str
    username: str
    role_id: int
    invited_by: Optional[int]
    max_task_available: Optional[int]
    score_sum: Optional[float]
    has_unchecked_tasks: Optional[bool]
    is_active: bool = True
    is_superuser: bool = False
    is_verified: bool = False

    class Config:
        orm_mode = True


class UserCreate(schemas.BaseUserCreate):
    username: str
    email: str
    password: str
    role_id: int
    invited_by: Optional[str]
    is_active: Optional[bool] = True
    is_superuser: Optional[bool] = False
    is_verified: Optional[bool] = False


class UserUpdate(schemas.BaseUserUpdate):
    pass
