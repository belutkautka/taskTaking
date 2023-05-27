import datetime

from fastapi import APIRouter, Depends, HTTPException
# from fastapi_cache.decorator import cache
from sqlalchemy import select, insert, delete, and_
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.base_config import fastapi_users
from src.auth.models import User
from src.database import get_async_session
from src.tasks.models import task, taken_task
from src.tasks.schemas import TaskCreate

router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"]
)

current_user = fastapi_users.current_user()


@router.get('/get_tasks_by_teacher_id')
# @cache(expire=3600)
async def get_tasks_by_teacher_id(session: AsyncSession = Depends(get_async_session), user: User = Depends(current_user)):
    try:
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
    except Exception:
        raise HTTPException(status_code=500, detail=
        {
            'Status': 'Error',
            'Data': None,
            'Details': None
        })


@router.get('/get_my_taken_tasks')
async def get_my_taken_tasks(session: AsyncSession = Depends(get_async_session), user: User = Depends(current_user)):
    if user.id != 2:
        raise Exception
    query = select(taken_task).where(taken_task.c.user_id == user.id)
    result = await session.execute(query)
    return {
        'Status': 'Success',
        'Data': [r._asdict() for r in result],
        'Details': None
        }


@router.post('/take_task')
# @cache(expire=3600)
async def take_task(task_id: int, session: AsyncSession = Depends(get_async_session), user: User = Depends(current_user)):
    if user.role_id != 2:
        raise Exception

    query = select(task).where(task.c.id == task_id)
    res = await session.execute(query)

    task_dict = [r._asdict() for r in res]
    max = task_dict[0]['taken_max']

    query = select(taken_task).where(task.c.id == task_id)
    res = await session.execute(query)
    task_dict = [r._asdict() for r in res]
    if len(task_dict) == max:
        raise Exception
    stmt = insert(taken_task).values((task_id, user.id))
    await session.execute(stmt)
    await session.commit()
    return {'Status': 'Success'}
    # except Exception:
    #     raise HTTPException(status_code=500, detail=
    #     {
    #         'Status': 'Error',
    #         'Data': None,
    #         'Details': None
    #     })


@router.post('/drop_task')
# @cache(expire=3600)
async def drop_task(task_id: int, session: AsyncSession = Depends(get_async_session), user: User = Depends(current_user)):
    if user.role_id != 2:
        raise Exception
    query = delete(taken_task).where(and_(taken_task.c.task_id == task_id, taken_task.c.user_id == user.id))
    # query = delete(taken_task).where(taken_task.c.user_id == user.id)
    await session.execute(query)
    await session.commit()
    return {'Status': 'Success'}


@router.post('/add_task')
async def add_task(new_task: TaskCreate, session: AsyncSession = Depends(get_async_session), user: User = Depends(current_user)):
    try:
        if user.role_id != 1:
            raise Exception

        data = new_task.dict()
        data['added_by'] = user.id
        data['dead_line'] = datetime.datetime.utcnow() + datetime.timedelta(days=data['dead_line'])

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
