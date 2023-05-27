from typing import Optional, Annotated

from pydantic import BaseModel
from fastapi import APIRouter, Request, Header
from tortoise.exceptions import IntegrityError
from tortoise.contrib.pydantic import pydantic_model_creator  # type: ignore

from core import Password, APIHTTPExceptions, verify_auth_key

password_router = APIRouter(
    tags=[
        "Passwords",
    ],
    prefix="/api/passwords",
)
pswd_pyd = pydantic_model_creator(Password)


class NewPassword(BaseModel):
    name: str
    username: str
    password: str
    salt: str
    url: str
    note: Optional[str] = None
    owner_id: str


@password_router.post("/")
async def create_password(
    request: Request,
    password_data: NewPassword,
    auth_key: Annotated[str, Header()],
) -> dict:
    """
    Endpoint to create a brand new password record

    Parameters:
        body: {
            name (str)
            username (str)
            password (str)
            salt (str)
            url (str)
            note (str)
            owner_id (str): The UUID of the account this password will be added to
        } (request body is bascially just the data for the new password)
        auth_key (str): Key used to authenticate request
    """
    await verify_auth_key(password_data.owner_id, auth_key)

    try:
        # pass in all data as kwargs to Password.create method
        password = await Password.create(**dict(password_data))
    except (ValueError, IntegrityError) as e:
        # user id provided just aint it chief
        raise APIHTTPExceptions.USER_NOT_FOUND(password_data.owner_id) from e

    pyd = await pswd_pyd.from_tortoise_orm(password)

    return {
        "success": True,
        "detail": "Successfully added password to database!",
        "password": pyd,
    }


@password_router.get("/")
async def get_password(
    request: Request,
    owner_id: str,
    auth_key: Annotated[str, Header()],
    password_id: Optional[str] = None,
) -> dict:
    """
    Get a password or list of password from the database

    Parameters:
        owner_id (str): UUID of account owner
        auth_key (str): Key to authenticate request maker
        password_id (Optional[str], default=None): By default this function will return all
            the users passwords but if a password (UU)ID is provided it will just return that
    """
    await verify_auth_key(owner_id, auth_key)

    if password_id is not None:  # only return one specific password
        password = await Password.filter(id=password_id, owner_id=owner_id).first()
        if password is None:
            raise APIHTTPExceptions.PASSWORD_NOT_FOUND(password_id)

        pyd = await pswd_pyd.from_tortoise_orm(password)

        return {"success": True, "password": pyd}

    # get all the passwords
    passwords = await Password.filter(owner_id=owner_id)
    pyd = [await pswd_pyd.from_tortoise_orm(pswd) for pswd in passwords]
    return {"success": True, "passwords": list(pyd)}


@password_router.delete("/")
async def delete_password(
    request: Request,
    password_id: str,
    owner_id: str,
    auth_key: Annotated[str, Header()],
) -> dict:
    """
    Delete a password from the database

    Parameters:
        password_id (str): UUID of the password that will be deleted
        owner_id (str): UUID of account owner
        auth_key (str): Key to authenticate request maker
    """

    await verify_auth_key(owner_id, auth_key)

    password = await Password.filter(id=password_id, owner_id=owner_id).first()
    if password is None:
        raise APIHTTPExceptions.PASSWORD_NOT_FOUND(password_id)

    await password.delete()

    return {"success": True, "detail": "Password deleted successfully!"}


@password_router.patch("/")
async def update_existing_password(
    request: Request,
    password_id: str,
    owner_id: str,
    new_data: dict,
    auth_key: Annotated[str, Header()],
) -> dict:
    await verify_auth_key(owner_id, auth_key)

    password = await Password.filter(id=password_id, owner_id=owner_id).first()
    if password is None:
        raise APIHTTPExceptions.PASSWORD_NOT_FOUND(password_id)

    update_data = {}
    attrs = [
        "name",
        "username",
        "password",
        "salt",
        "url",
        "note",
    ]
    for attr, new_val in new_data.items():
        # remove invalid ones attributes
        if attr not in attrs:
            continue

        attrs.remove(attr)
        update_data[attr] = new_val

    # This following code may look "sus" as the kids say
    # It basically just reuses the validation function that i used when a new password is created
    # this is so no one gets around the password initial validation checks by editing their password
    NewPassword(
        **update_data,
        **{attr: getattr(password, attr) for attr in attrs},
        owner_id=owner_id,
    )

    await password.update_from_dict(update_data).save()

    return {"success": True, "detail": "The password has been updated!"}
