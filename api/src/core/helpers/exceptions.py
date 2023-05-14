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


class ExampleHTTPException(HTTPException):
    def __init__(self, data: str) -> None:
        status_code = 422
        detail = {
            "success": False,
            "detail": "Failed because you gave me bad input",
            "data_given": data,
            "tip": "Get better skill issue",
        }

        super().__init__(status_code, detail)


class APIHTTPExceptions:
    """
    All the api's http exceptions in a class so they are all together
    """

    EXAMPLE_HTTP_EXCEPTION = ExampleHTTPException
