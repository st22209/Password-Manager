from fastapi import APIRouter

password_router = APIRouter(
    tags=[
        "Passwords",
    ],
    prefix="/api/passwords",
)


@password_router.get("/")
async def get_password():
    pass
