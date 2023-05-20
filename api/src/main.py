""" (script)
python script to start the rest api and load routes
"""

__version__ = "0.0.1"
__author__ = ["FusionSid"]

import os
from typing import Final

import uvicorn
from rich import print
from dotenv import load_dotenv
from tortoise.contrib.fastapi import register_tortoise

from routes import router_list, middleware_list
from core import PasswordManager, TORTOISE_CONFIG, InvalidDevmodeValue

load_dotenv()
app = PasswordManager(__version__)


@app.on_event("startup")
async def startup_event():
    """
    Runs on API startup and prints a message to console
    """

    print("[bold blue]API has started!")


@app.on_event("shutdown")
async def shutdown_event():
    """
    Runs on API shutdown and prints a message to console
    """

    print("[bold blue]API has been shutdown!")


# iterate through routers list and include them all
for route in router_list:
    app.include_router(router=route)

# iterate through middleware list and include them all
for middleware in middleware_list:
    app.add_middleware(middleware)

# initialize tortoise orm and connect to database through it
register_tortoise(
    app,
    config=TORTOISE_CONFIG,
    generate_schemas=True,
    add_exception_handlers=True,
)

# constant for the port the api will use
PORT: Final = 8443

# check weather to startup api in dev mode or not
devmode = os.environ.get("DEVMODE", "").lower()
if devmode not in ["true", "false"]:
    raise InvalidDevmodeValue(provided=devmode)

if devmode == "true":
    options = {"app": "main:app", "port": PORT, "reload": True}
else:
    options = {
        "app": "main:app",
        "reload": False,
        "port": PORT,
        "access_log": False,
        "log_level": "critical",
    }


if __name__ == "__main__":
    # start uvicorn server with chosen config options
    uvicorn.run(**options)
