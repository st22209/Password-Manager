from typing import Annotated, Optional

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
    request: Request, user_id: str, auth_key: str, username: Optional[bool] = False
) -> dict:
    """
    Endpoint to fetch the user from the database
    The purpose of this url is so that if you have a userID you can get the username
    and vice versa so if you have the username you can find the user id

    Parameters:
        user_id (str): either a UUID or a username which belong to a user
        auth_key (str): the authentication key needed by the user to authenticate themselves
        username (Optional[bool], default=false): If this is false the user_id parameter is a UUID
            if this is set to true it means the user_id parameter is a username
    """

    # changes query (arguments inside the User.filter() method)
    # based on if username parameter is set to true or not
    query = "username" if username else "id"
    user = await User.filter(**{query: user_id}).first()

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
    """
    Endpoint to delete a user

    Parameters:
        user_id (str): UUID of the user you want to delete
        auth_key (str): Needed to verify you are the account holder
    """

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
    """
    Endpoint to update a user's password
    This allows you to change the auth hash of the user, this would be used
    when you are editing the password of a user

    Parameters:
        body: {
            user_id (str): The UUID of the user whos hash you are updating
            auth_key (str): The new auth key of the user, this will be hashed serverside (here)
        }
        auth_key: the auth_key of the user before being updated, needed to authenticate and
            verify you are the person allowed to perform this opperation
    """

    await new_data.hashpass()
    await verify_auth_key(new_data.user_id, auth_key)

    user = await User.filter(id=new_data.user_id).first()
    if user is None:
        raise APIHTTPExceptions.USER_NOT_FOUND(new_data.user_id)
    await user.update_from_dict({"auth_key_hash": new_data.auth_key}).save()

    return {"success": True, "detail": "User auth hash updated successfully!"}


@user_router.post("/")
async def create_new_user(request: Request, user_data: NewUser):
    """
    endpoint to create a branch new user (signup)

    Parameters:
        body: {
            username (str): The username of this new user
            auth_key (str): The auth key for this new user
        }
    """

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
