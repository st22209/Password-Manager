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
async def get_user(request: Request):
    pass


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
