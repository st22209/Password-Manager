from fastapi import APIRouter
from tortoise.contrib.pydantic import pydantic_model_creator  # type: ignore
from core import Password

password_router = APIRouter(
    tags=[
        "Passwords",
    ],
    prefix="/api/passwords",
)
pswd_pyd = pydantic_model_creator(Password, name="User")


@password_router.get("/")
async def get_password():
    pass
