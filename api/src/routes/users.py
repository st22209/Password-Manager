from fastapi import APIRouter
from fastapi.responses import RedirectResponse

user_router = APIRouter(
    tags=[
        "Users",
    ],
)


@user_router.get("/")
async def redirect_to_docs():
    return RedirectResponse("/docs")
