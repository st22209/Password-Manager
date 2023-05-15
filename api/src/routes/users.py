from fastapi import APIRouter

user_router = APIRouter(
    tags=[
        "Users",
    ],
    prefix="/api/users",
)


@user_router.get("/")
async def get_user():
    pass
