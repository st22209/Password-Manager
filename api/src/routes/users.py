from fastapi import APIRouter, Request
from tortoise.exceptions import IntegrityError
from tortoise.contrib.pydantic import pydantic_model_creator  # type: ignore

from core import NewUser, User, APIHTTPExceptions

user_router = APIRouter(
    tags=[
        "Users",
    ],
    prefix="/api/users",
)
user_pyd = pydantic_model_creator(User, name="User")


@user_router.get("/")
async def get_user(request: Request, user_id: str):
    exists = await User.exists(id=user_id)
    if not exists:
        raise APIHTTPExceptions.USER_NOT_FOUND(user_id)

    user = await User.get(id=user_id)
    pyd = await user_pyd.from_tortoise_orm(user)

    return {"success": True, "user": pyd}


@user_router.delete("/")
async def delete_user(request: Request, user_id: str):
    exists = await User.exists(id=user_id)
    if not exists:
        raise APIHTTPExceptions.USER_NOT_FOUND(user_id)

    user = User.filter(id=user_id)
    await user.delete()

    return {"success": True, "detail": "User deleted successfully!"}


@user_router.post("/")
async def create_new_user(request: Request, user_data: NewUser):
    try:
        user = await User.create(
            username=user_data.username, auth_key_hash=user_data.auth_key_hash
        )
    except IntegrityError:
        raise APIHTTPExceptions.USERNAME_CONFLICT_ERROR

    pyd = await user_pyd.from_tortoise_orm(user)
    return {
        "success": True,
        "detail": "User created successfully!",
        "created_user": pyd,
    }
