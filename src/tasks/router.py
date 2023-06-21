import datetime

from fastapi import APIRouter, Depends, HTTPException
# from fastapi_cache.decorator import cache
from sqlalchemy import select, insert, delete, and_, update, join
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.base_config import fastapi_users
from src.auth.models import User
from src.auth.models import user as user_table
from src.database import get_async_session
from src.tasks.models import task, taken_task
from src.tasks.schemas import TaskCreate, TaskUpdate

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
            query = select(task).where(task.c.added_by == user.id).order_by(task.c.dead_line)
        else:
            query = select(task).where(task.c.added_by == user.invited_by).order_by(task.c.dead_line)

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


@router.get('/get_students_by_task_id')
async def get_students_by_task_id(task_id: int, session: AsyncSession = Depends(get_async_session), user: User = Depends(current_user)):
    try:
        query = select(taken_task).where(taken_task.c.task_id == task_id)
        result = await session.execute(query)

        students = [x['user_id'] for x in [r._asdict() for r in result]]

        query = select(user_table.c.username).where(user_table.c.id.in_(students))
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
    if user.role_id != 2:
        raise HTTPException(status_code=405, detail=
        {
            'Status': 'Error',
            'Data': None,
            'Details': 'Not a student'
        })

    query = select(taken_task).where(taken_task.c.user_id == user.id).order_by(task.c.dead_line)
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
        raise HTTPException(status_code=405, detail=
        {
            'Status': 'Error',
            'Data': None,
            'Details': 'Not a student'
        })

    query = select(task).where(task.c.id == task_id)
    res = await session.execute(query)

    task_dict = [r._asdict() for r in res]
    max = task_dict[0]['taken_max']

    query = select(taken_task).where(task.c.id == task_id)
    res = await session.execute(query)
    task_dict = [r._asdict() for r in res]
    if len(task_dict) == max:
        raise HTTPException(status_code=422, detail=
        {
            'Status': 'Error',
            'Data': None,
            'Details': f'{max} students already took this task'
        })
    try:
        stmt = insert(taken_task).values((task_id, user.id))
        await session.execute(stmt)
        await session.commit()
    except:
        raise HTTPException(status_code=422, detail=
        {
            'Status': 'Error',
            'Data': None,
            'Details': f'You already took this task'
        })

    if len(task_dict) + 1 == max:
        await session.execute(update(task).where(task.c.id == task_id).values(is_available=False))
        await session.commit()

    return {
        'Status': 'Success',
        'Data': None,
        'Details': None
    }


@router.post('/drop_task')
# @cache(expire=3600)
async def drop_task(task_id: int, session: AsyncSession = Depends(get_async_session), user: User = Depends(current_user)):
    if user.role_id != 2:
        raise HTTPException(status_code=405, detail=
        {
            'Status': 'Error',
            'Data': None,
            'Details': 'Not a student'
        })
    try:
        query = delete(taken_task).where(and_(taken_task.c.task_id == task_id, taken_task.c.user_id == user.id))
        await session.execute(query)
        await session.commit()

        await session.execute(update(task).where(task.c.id == task_id).values(is_available=True))
        await session.commit()

        return {
            'Status': 'Success',
            'Data': None,
            'Details': None
        }
    except:
        return {
            'Status': 'Error',
            'Data': None,
            'Details': None
        }


@router.post('/add_task')
async def add_task(new_task: TaskCreate, session: AsyncSession = Depends(get_async_session), user: User = Depends(current_user)):
    try:
        if user.role_id != 1:
            raise Exception
        data = new_task.dict()

        data['added_by'] = user.id
        data['dead_line'] = datetime.datetime.utcnow() + datetime.timedelta(days=data['dead_line'])
        data['is_available'] = True

        stmt = insert(task).values(data)
        await session.execute(stmt)
        await session.commit()
        return {'Status': 'Success'}
    except Exception:
        raise HTTPException(status_code=405, detail=
        {
            'Status': 'Error',
            'Data': None,
            'Details': 'Not a teacher'
        })


@router.post('/update_task')
async def add_task(updated_task: TaskUpdate, session: AsyncSession = Depends(get_async_session), user: User = Depends(current_user)):
    # try:
        if user.role_id != 1:
            raise Exception

        stmt = select(task).where(task.c.id == updated_task.task_id)
        res = await session.execute(stmt)
        task_dict = [r._asdict() for r in res]
        if user.id != task_dict[0]['added_by']:
            raise Exception
        print(task_dict)
        data = {}

        data['description'] = updated_task.description
        data['taken_max'] = updated_task.taken_max
        data['dead_line'] = task_dict[0]['dead_line'] + datetime.timedelta(days=updated_task.dead_line)
        data['task_value'] = updated_task.task_value

        stmt = update(task).values(data).where(task.c.id == updated_task.task_id)
        await session.execute(stmt)
        await session.commit()
        return {'Status': 'Success'}
    # except Exception:
    #     raise HTTPException(status_code=405, detail=
    #     {
    #         'Status': 'Error',
    #         'Data': None,
    #         'Details': 'Not a teacher'
    #     })
