__all__ = ("router_list", "middleware_list")

from .other import other_router
from .passwords import password_router
from .users import user_router

router_list = [other_router, password_router, user_router]
middleware_list = []
