from fastapi import APIRouter, Request
from tortoise.exceptions import IntegrityError
from tortoise.contrib.pydantic import pydantic_model_creator  # type: ignore

from core import NewUser, User

user_router = APIRouter(
    tags=[
        "Users",
    ],
    prefix="/api/users",
)


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
        return {
            "success": False,
            "detail": "User failed to create! most likey because of a username conflict. ",
            "tip": "Try using another username or trying again later.",
        }

    user_pyd = await pydantic_model_creator(User, name="User").from_tortoise_orm(user)
    return {
        "success": True,
        "detail": "User created successfully!",
        "created_user": user_pyd,
    }
