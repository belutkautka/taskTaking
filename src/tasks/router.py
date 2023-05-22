from fastapi import APIRouter, Depends, HTTPException
# from fastapi_cache.decorator import cache
from sqlalchemy import select, insert
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_async_session
from src.tasks.models import task
from src.tasks.schemas import TaskCreate
from src.auth.base_config import fastapi_users
from src.auth.models import User

router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"]
)

current_user = fastapi_users.current_user()


@router.get('/')
# @cache(expire=3600)
async def get_task_by_teacher_id(session: AsyncSession = Depends(get_async_session), user: User = Depends(current_user)):
    # try:
    if user.role_id == 1:
        query = select(task).where(task.c.added_by == user.id)
    else:
        query = select(task).where(task.c.added_by == user.invited_by)

    result = await session.execute(query)

    return {
        'Status': 'Success',
        'Data': [r._asdict() for r in result],
        'Details': None
    }
    # except Exception:
    #     raise HTTPException(status_code=500, detail=
    #     {
    #         'Status': 'Error',
    #         'Data': None,
    #         'Details': None
    #     })


@router.post('/')
async def add_task(new_task: TaskCreate, session: AsyncSession = Depends(get_async_session), user: User = Depends(current_user)):
    try:
        if user.role_id != 1:
            raise Exception
        data = new_task.dict()
        print(data)
        data['added_by'] = user.id
        stmt = insert(task).values(data)
        await session.execute(stmt)
        await session.commit()
        return {'Status': 'Success'}
    except Exception:
        raise HTTPException(status_code=405, detail=
        {
            'Status': 'Not a teacher',
            'Data': None,
            'Details': None
        })
