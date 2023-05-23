""" (module) exception
This module contains exceptions to make development easier
"""

import sys
from enum import Enum

from rich.text import Text
from rich.panel import Panel
from rich.console import Console
from fastapi import HTTPException


class BaseException(Exception):
    """Base class for other exceptions to inherit form"""

    pass


class HTTPStatusCodes(Enum):
    """Custom HTTP status codes to use internally"""

    EXAMPLE_STATUS_CODE = 461


class RichBaseException(BaseException):
    """
    Base rich class for other exceptions to inherit form
    This one prints the error to console with rich
    """

    def __init__(self, title: str, message: str) -> None:
        error_message = Panel(
            Text.from_markup(f"[yellow]{message}"),
            title=title,
            border_style="red",
        )
        Console().print(error_message, justify="left")
        super().__init__()


class InvalidDevmodeValue(RichBaseException):
    def __init__(self, provided: str) -> None:
        super().__init__(
            "INVALID RUN MODE!!!",
            f"DEVMODE can either be 'true' or 'false'. You provided: {provided} which is not valid!",
        )
        sys.exit(1)


class InvalidUsernameError(HTTPException):
    def __init__(self, username: str) -> None:
        status_code = 422
        detail = {
            "success": False,
            "detail": "Username failed checks",
            "username_provided": username,
            "tip": "Follow the criteria",
            "criteria": [
                "username must be 3-32 characters long",
                "no _ or . allowed at the beginning",
                "no __ or _. or ._ or .. inside",
                "no _ or . at the end",
                "username can not start with a number",
                "Allowed Characters: a-z, A-Z, 0-9, '.' and '_'",
            ],
        }

        super().__init__(status_code, detail)


class UsernameConflictError(HTTPException):
    def __init__(self) -> None:
        status_code = 409
        detail = {
            "success": False,
            "detail": "User failed to create! most likey because of a username conflict. ",
            "tip": "Try using another username or trying again later.",
        }

        super().__init__(status_code, detail)


class UserNotFound(HTTPException):
    def __init__(self, provided: str) -> None:
        status_code = 404
        detail = {
            "success": False,
            "detail": "The user id/username you provided does not exist",
            "provided_value": provided,
            "tip": "Double check the value you are providing",
        }
        super().__init__(status_code, detail)


class PasswordNotFound(HTTPException):
    def __init__(self, provided: str) -> None:
        status_code = 404
        detail = {
            "success": False,
            "detail": "The password id you provided does not exist",
            "provided_value": provided,
            "tip": "Double check the value you are providing",
        }
        super().__init__(status_code, detail)


class InvalidAuthKey(HTTPException):
    def __init__(self, auth_key: str) -> None:
        status_code = 401
        detail = {
            "success": False,
            "detail": "The auth key provided is invalid",
            "provided_value": auth_key,
            "tip": "This means you entered the wrong master password, try again",
        }
        super().__init__(status_code, detail)


class APIHTTPExceptions:
    """
    All the api's http exceptions in a class so they are all together
    """

    INVALID_USERNAME_ERROR = InvalidUsernameError
    USERNAME_CONFLICT_ERROR = UsernameConflictError
    USER_NOT_FOUND = UserNotFound
    PASSWORD_NOT_FOUND = PasswordNotFound
    INVALID_AUTH_KEY = InvalidAuthKey
