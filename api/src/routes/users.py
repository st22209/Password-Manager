from typing import Annotated

from fastapi import APIRouter, Request, Header
from tortoise.exceptions import IntegrityError
from tortoise.contrib.pydantic import pydantic_model_creator  # type: ignore

from core import NewUser, User, APIHTTPExceptions, AuthModification, verify_auth_key

user_router = APIRouter(
    tags=[
        "Users",
    ],
    prefix="/api/users",
)
user_pyd = pydantic_model_creator(User)


@user_router.get("/")
async def get_user(request: Request, user_id: str):
    user = await User.get(id=user_id)
    if user is None:
        raise APIHTTPExceptions.USER_NOT_FOUND(user_id)

    pyd = await user_pyd.from_tortoise_orm(user)
    delattr(pyd, "auth_key_hash")

    return {"success": True, "user": pyd}


@user_router.delete("/")
async def delete_user(
    request: Request,
    user_id: str,
    auth_key: Annotated[str, Header()],
):
    await verify_auth_key(user_id, auth_key)

    user = await User.get(id=user_id)
    if user is None:
        raise APIHTTPExceptions.USER_NOT_FOUND(user_id)

    await user.delete()

    return {"success": True, "detail": "User deleted successfully!"}


@user_router.patch("/")
async def modify_user_authkey(
    request: Request,
    new_data: AuthModification,
    auth_key: Annotated[str, Header()],
):
    await new_data.hashpass()
    await verify_auth_key(new_data.user_id, auth_key)

    user = await User.get(id=new_data.user_id)
    if user is None:
        raise APIHTTPExceptions.USER_NOT_FOUND(new_data.user_id)
    await user.update_from_dict({"auth_key_hash": new_data.auth_key}).save()

    return {"success": True, "detail": "User auth hash updated successfully!"}


@user_router.post("/")
async def create_new_user(request: Request, user_data: NewUser):
    await user_data.hashpass()

    try:
        user = await User.create(
            username=user_data.username, auth_key_hash=user_data.auth_key
        )
    except IntegrityError:
        raise APIHTTPExceptions.USERNAME_CONFLICT_ERROR

    pyd = await user_pyd.from_tortoise_orm(user)
    return {
        "success": True,
        "detail": "User created successfully!",
        "user": pyd,
    }
