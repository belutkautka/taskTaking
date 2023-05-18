from fastapi import APIRouter, Depends
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
async def get_task(task_id: int, session: AsyncSession = Depends(get_async_session)):
    query = select(task).where(task.c.id == task_id).limit(1)
    result = await session.execute(query)
    return result.all()


@router.post('/')
async def add_task(new_task: TaskCreate, session: AsyncSession = Depends(get_async_session)):
    stmt = insert(new_task).values(**new_task().dict())
    await session.execute()
    await session.commit()
    return {'status': 'success'}
