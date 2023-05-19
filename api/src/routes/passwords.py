from typing import Optional

from pydantic import BaseModel
from fastapi import APIRouter, Request
from tortoise.contrib.pydantic import pydantic_model_creator  # type: ignore

from core import Password, APIHTTPExceptions

password_router = APIRouter(
    tags=[
        "Passwords",
    ],
    prefix="/api/passwords",
)
pswd_pyd = pydantic_model_creator(Password, name="User")


class NewPassword(BaseModel):
    name: str
    username: str
    password: str
    salt: str
    url: str
    note: str


@password_router.post("/")
async def create_password(request: Request, password_data: NewPassword):
    password = await Password.create(**dict(password_data))
    pyd = await pswd_pyd.from_tortoise_orm(password)

    return {
        "success": True,
        "detail": "Successfully added password to database!",
        "password": pyd,
    }


@password_router.get("/")
async def get_password(request: Request, password_id: Optional[str] = None):
    if password_id is not None:
        exists = await Password.exists(id=password_id)
        if not exists:
            raise APIHTTPExceptions.PASSWORD_NOT_FOUND(password_id)

        password = await Password.get(id=password_id)
        pyd = await pswd_pyd.from_tortoise_orm(password)

        return {"success": True, "password": pyd}

    passwords = await Password.all()
    pyd = [await pswd_pyd.from_tortoise_orm(pswd) for pswd in passwords]
    return {"success": True, "passwords": list(pyd)}


@password_router.delete("/")
async def delete_password(request: Request, password_id: str):
    exists = await Password.exists(id=password_id)
    if not exists:
        raise APIHTTPExceptions.PASSWORD_NOT_FOUND(password_id)

    password = Password.filter(id=password_id)
    await password.delete()

    return {"success": True, "detail": "Password deleted successfully!"}
