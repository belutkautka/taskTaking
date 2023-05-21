from fastapi import APIRouter, Depends, HTTPException
from fastapi_cache.decorator import cache
from sqlalchemy import select, insert
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_async_session
from src.tasks.models import task
from src.tasks.schemas import TaskCreate

router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"]
)


@router.get('/')
# @cache(expire=3600)
async def get_task(task_id: int, session: AsyncSession = Depends(get_async_session)):
    try:
        query = select(task).where(task.c.id == task_id).limit(1)
        result = await session.execute(query)
        return {
            'Status': 'Success',
            'Data': result.all(),
            'Details': None
        }
    except Exception:
        raise HTTPException(status_code=500, detail=
        {
            'Status': 'Error',
            'Data': None,
            'Details': None
        })


@router.post('/')
async def add_task(new_task: TaskCreate, session: AsyncSession = Depends(get_async_session)):
    stmt = insert(task).values(**new_task.dict())
    await session.execute(stmt)
    await session.commit()
    return {'status': 'success'}
