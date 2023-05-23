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
async def get_user(
    request: Request, user_id: str, auth_key: str, username: bool = False
):
    if username:
        user = await User.filter(username=user_id).first()
    else:
        user = await User.filter(id=user_id).first()
    if user is None:
        raise APIHTTPExceptions.USER_NOT_FOUND(user_id)

    await verify_auth_key(user.id, auth_key)  # type: ignore
    pyd = await user_pyd.from_tortoise_orm(user)

    return {"success": True, "user": pyd}


@user_router.delete("/")
async def delete_user(
    request: Request,
    user_id: str,
    auth_key: Annotated[str, Header()],
):
    await verify_auth_key(user_id, auth_key)

    user = await User.filter(id=user_id).first()
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

    user = await User.filter(id=new_data.user_id).first()
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
    except IntegrityError as e:
        raise APIHTTPExceptions.USERNAME_CONFLICT_ERROR from e

    pyd = await user_pyd.from_tortoise_orm(user)
    return {
        "success": True,
        "detail": "User created successfully!",
        "user": pyd,
    }
