from fastapi import APIRouter
from fastapi.responses import RedirectResponse

other_router = APIRouter(
    tags=[
        "Other",
    ],
)


@other_router.get("/")
async def redirect_to_docs() -> RedirectResponse:
    """
    This simply just redirects anyone going to the base url to the swagger api docs
    """
    return RedirectResponse("/docs")
