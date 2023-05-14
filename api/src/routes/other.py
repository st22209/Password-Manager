from fastapi import APIRouter
from fastapi.responses import RedirectResponse

other_router = APIRouter(
    tags=[
        "Other",
    ],
)


@other_router.get("/")
async def redirect_to_docs():
    return RedirectResponse("/docs")
