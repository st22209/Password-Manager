from fastapi import APIRouter
from fastapi.responses import RedirectResponse

password_router = APIRouter(
    tags=[
        "Passwords",
    ],
)


@password_router.get("/")
async def redirect_to_docs():
    return RedirectResponse("/docs")
