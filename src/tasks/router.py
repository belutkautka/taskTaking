import datetime

from fastapi import APIRouter, Depends, HTTPException
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


@router.get('/get_students_by_teacher_id')
async def get_students_by_teacher_id(session: AsyncSession = Depends(get_async_session),
                                     user: User = Depends(current_user)):
    if user.role_id == 1:
        query = select(user_table.c.username, user_table.c.score_sum).where(user_table.c.invited_by == user.id) \
            .order_by(user_table.c.score_sum)
    else:
        query = select(user_table.c.username, user_table.c.score_sum).where(user_table.c.invited_by == user.invited_by) \
            .order_by(user_table.c.score_sum)

    result = await session.execute(query)

    return {
        'Status': 'Success',
        'Data': [r._asdict() for r in result],
        'Details': None
    }


@router.get('/get_unchecked_task')
async def get_unchecked_task(session: AsyncSession = Depends(get_async_session),
                             user: User = Depends(current_user)):
    if user.role_id == 1:
        raise HTTPException(status_code=405, detail=
        {
            'Status': 'Error',
            'Data': None,
            'Details': 'Not a student'
        })

    if not user.has_unchecked_tasks:
        return {
            'Status': 'No unchecked tasks',
            'Data': [],
            'Details': None
        }

    query = select(task.c.id, task.c.name, task.c.task_value, taken_task.c.score) \
        .join(taken_task, task.c.id == taken_task.c.task_id) \
        .where(and_(taken_task.c.user_id == user.id, taken_task.c.is_checked == False))
    checked_tasks = await session.execute(query)

    await session.execute(update(taken_task) \
                          .where(and_(taken_task.c.user_id == user.id, taken_task.c.is_checked == False)) \
                          .values(is_checked=True))
    await session.commit()

    await session.execute(update(user_table)
                          .where(user_table.c.id == user.id)
                          .values(has_unchecked_tasks=False))
    await session.commit()

    return {
        'Status': 'Success',
        'Data': [r._asdict() for r in checked_tasks],
        'Details': None
    }


@router.get('/get_tasks_by_teacher_id')
async def get_tasks_by_teacher_id(session: AsyncSession = Depends(get_async_session),
                                  user: User = Depends(current_user)):
    try:
        current_dt = datetime.datetime.utcnow()

        if user.role_id == 2:
            query = select(task) \
                .where(and_(task.c.added_by == user.invited_by, task.c.dead_line > current_dt)) \
                .order_by(task.c.dead_line)
            result = await session.execute(query)

            return {
                'Status': 'Success',
                'Data': [r._asdict() for r in result],
                'Details': None
            }

        query = select(task, user_table.c.username, taken_task.c.score, taken_task.c.user_id) \
            .outerjoin(taken_task, task.c.id == taken_task.c.task_id) \
            .outerjoin(user_table, user_table.c.id == taken_task.c.user_id) \
            .where(and_(task.c.added_by == user.id, task.c.dead_line > current_dt)) \
            .order_by(task.c.dead_line)

        result = await session.execute(query)
        result = [r._asdict() for r in result]

        out = dict()

        for elem in result:
            if elem['username'] is None:
                out[elem['id']] = elem.copy()
                continue
            else:
                if elem['id'] not in out.keys():
                    out[elem['id']] = elem.copy()
                    out[elem['id']]['user_id'] = []
                    out[elem['id']]['username'] = []
                    out[elem['id']]['score'] = []
                out[elem['id']]['user_id'].append(elem['user_id'])
                out[elem['id']]['username'].append(elem['username'])
                out[elem['id']]['score'].append(elem['score'])

        return {
            'Status': 'Success',
            'Data': list(out.values()),
            'Details': None
        }
    except Exception:
        raise HTTPException(status_code=500, detail={
            'Status': 'Error',
            'Data': None,
            'Details': None
        })


@router.get('/get_students_by_task_id')
async def get_students_by_task_id(task_id: int, session: AsyncSession = Depends(get_async_session),
                                  user: User = Depends(current_user)):
    # try:
    # query = select(taken_task).where(taken_task.c.task_id == task_id)
    # result = await session.execute(query)
    #
    # students = [x['user_id'] for x in [r._asdict() for r in result]]
    #
    # query = select(user_table.c.username).where(user_table.c.id.in_(students))
    # result = await session.execute(query)

    query = select(user_table.c.username, taken_task.c.score) \
        .join(taken_task, user_table.c.id == taken_task.c.user_id) \
        .where(taken_task.c.task_id == task_id)

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


@router.get('/get_my_taken_tasks')
async def get_my_taken_tasks(session: AsyncSession = Depends(get_async_session), user: User = Depends(current_user)):
    if user.role_id != 2:
        raise HTTPException(status_code=405, detail=
        {
            'Status': 'Error',
            'Data': None,
            'Details': 'Not a student'
        })

    query = select(task.c.id, task.c.name, task.c.task_value, taken_task.c.score) \
        .join(taken_task, task.c.id == taken_task.c.task_id) \
        .where(taken_task.c.user_id == user.id)
    result = await session.execute(query)

    return {
        'Status': 'Success',
        'Data': [r._asdict() for r in result],
        'Details': None
    }


@router.post('/take_task')
async def take_task(task_id: int, answer: str, session: AsyncSession = Depends(get_async_session),
                    user: User = Depends(current_user)):
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
    max_task_cnt = task_dict[0]['taken_max']

    query = select(taken_task).where(taken_task.c.task_id == task_id)
    res = await session.execute(query)
    task_dict = [r._asdict() for r in res]

    if len(task_dict) == max_task_cnt:
        raise HTTPException(status_code=422, detail=
        {
            'Status': 'Error',
            'Data': None,
            'Details': f'{max_task_cnt} students already took this task'
        })
    try:
        stmt = insert(taken_task).values((task_id, user.id,answer, 0, True,answer))
        await session.execute(stmt)
        await session.commit()
    except:
        raise HTTPException(status_code=422, detail=
        {
            'Status': 'Error',
            'Data': None,
            'Details': f'You already took this task'
        })

    if len(task_dict) + 1 == max_task_cnt:
        await session.execute(update(task)
                              .where(task.c.id == task_id)
                              .values(is_available=False))
        await session.commit()

    return {
        'Status': 'Success',
        'Data': None,
        'Details': None
    }


@router.post('/drop_task')
async def drop_task(task_id: int, session: AsyncSession = Depends(get_async_session),
                    user: User = Depends(current_user)):
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
async def add_task(new_task: TaskCreate, session: AsyncSession = Depends(get_async_session),
                   user: User = Depends(current_user)):
    try:
        # if user.role_id != 1:
        #      raise Exception
        data = new_task.dict()

        data['added_by'] = user.id
        data['dead_line'] = datetime.datetime.utcnow() + datetime.timedelta(days=data['dead_line'])
        data['is_available'] = True

        stmt = insert(task).values(data)
        await session.execute(stmt)
        await session.commit()
        return {'Status': 'Success'}
    except Exception as e:
        raise HTTPException(status_code=405, detail=
        {
            'Status': 'Error',
            'Data': None,
            'Details': str(e)
        })


@router.post('/update_task')
async def add_task(updated_task: TaskUpdate, session: AsyncSession = Depends(get_async_session),
                   user: User = Depends(current_user)):
    if user.role_id != 1:
        raise Exception

    stmt = select(task).where(task.c.id == updated_task.task_id)
    res = await session.execute(stmt)
    task_dict = [r._asdict() for r in res]

    if user.id != task_dict[0]['added_by']:
        raise Exception

    data = {'name': updated_task.name, 'description': updated_task.description, 'taken_max': updated_task.taken_max,
                'dead_line': task_dict[0]['dead_line'] + datetime.timedelta(days=updated_task.dead_line),
                'task_value': updated_task.task_value}

    stmt = update(task).values(data).where(task.c.id == updated_task.task_id)
    await session.execute(stmt)
    await session.commit()

    return {'Status': 'Success'}
    #except Exception as e:
    #    raise HTTPException(status_code=405, detail=
    #    {
    #        'Status': 'Error',
    ##        'Data': None,
     #       'Details': str(e)
     #   })


@router.post('/rate_task')
async def rate_task(task_id: int, user_id: int, score: float,
                    session: AsyncSession = Depends(get_async_session), user: User = Depends(current_user)):
    if user.role_id != 1:
        raise Exception

    data = {'task_id': task_id, 'user_id': user_id, 'score': score, 'is_checked': False}

    stmt = update(taken_task) \
        .values(data) \
        .where(and_(taken_task.c.task_id == task_id, taken_task.c.user_id == user_id))

    await session.execute(stmt)
    await session.commit()

    stmt = update(user_table) \
        .values({'has_unchecked_tasks': True,
                 'score_sum': user_table.c.score_sum + score}) \
        .where(user_table.c.id == user_id)

    await session.execute(stmt)
    await session.commit()

    return {'Status': 'Success'}

@router.post('/rate_task_flag')
async def rate_task(task_id: int, flag: str,
                    session: AsyncSession = Depends(get_async_session), user: User = Depends(current_user)):
    user_id=user.id
    query = select(task).where(task.c.id == task_id)
    res = await session.execute(query)
    task_dict = [r._asdict() for r in res]
    flag_e = task_dict[0]["flag"]
    if flag_e!=flag:
        raise Exception
    score = int(task_dict[0]["taken_max"])
    data = {'task_id': task_id,'message':"meow", 'answer':"meow", 'user_id': user_id, 'score': score, 'is_checked': False}

    stmt = update(taken_task) \
        .values(data) \
        .where(and_(taken_task.c.task_id == task_id, taken_task.c.user_id == user_id))

    await session.execute(stmt)
    await session.commit()

    stmt = update(user_table) \
        .values({'has_unchecked_tasks': True,
                 'score_sum': user_table.c.score_sum + score}) \
        .where(user_table.c.id == user_id)

    await session.execute(stmt)
    await session.commit()

    return {'Status': 'Success'}



@router.post('/delete_task')
async def delete_task(task_id: int, session: AsyncSession = Depends(get_async_session), user: User = Depends(current_user)):
    if user.role_id != 1:
        raise Exception

    query = select(taken_task)\
        .where(taken_task.c.task_id == task_id)\
        .limit(1)

    is_taken = bool(len([r._asdict() for r in await session.execute(query)]))

    if is_taken:
        return {
            'Status': 'Error',
            'Data': 'Task already taken',
            'Details': None
        }

    stmt = delete(task)\
        .where(and_(task.c.id == task_id, task.c.added_by == user.id))

    await session.execute(stmt)
    await session.commit()

    return {
        'Status': 'Success',
        'Data': None,
        'Details': None
    }
