from typing import Optional
from fastapi import Depends, Request
from fastapi_users import BaseUserManager, IntegerIDMixin, exceptions, models, schemas
from src.auth.models import User, user
from src.auth.utils import get_user_db
from src.config import SECRET_AUTH

# from src.database import get_async_session
# from sqlalchemy.ext.asyncio import AsyncSession
# from sqlalchemy import select

class UserManager(IntegerIDMixin, BaseUserManager[User, int]):
    reset_password_token_secret = SECRET_AUTH
    verification_token_secret = SECRET_AUTH

    async def on_after_register(self, user: User, request: Optional[Request] = None):
        print(f"User {user.id} has registered.")

    async def create(
        self,
        user_create: schemas.UC,
        safe: bool = False,
        # session: AsyncSession = Depends(get_async_session),
        request: Optional[Request] = None,
    ) -> models.UP:
        await self.validate_password(user_create.password, user_create)
        print(user_create.email)

        existing_user = await self.user_db.get_by_email(user_create.email)
        if existing_user is not None:
            raise exceptions.UserAlreadyExists()

        user_dict = (
            user_create.create_update_dict()
            if safe
            else user_create.create_update_dict_superuser()
        )
        password = user_dict.pop("password")
        user_dict["hashed_password"] = self.password_helper.hash(password)

        # result = await session.execute(select(user).where(user.c.email == user_dict["invited_by"]))
        # print(result.all())

        if user_dict["role_id"] not in (1, 2):
            user_dict['role_id'] = 2

        if user_dict['role_id'] == 1:
            user_dict['invited_by'] = None
        else:
            user_dict['max_task_available'] = 3

        created_user = await self.user_db.create(user_dict)

        await self.on_after_register(created_user, request)

        return created_user


async def get_user_manager(user_db=Depends(get_user_db)):
    yield UserManager(user_db)
