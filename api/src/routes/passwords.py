from typing import Optional
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


@password_router.get("/")
async def get_user(request: Request, password_id: Optional[str] = None):
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
