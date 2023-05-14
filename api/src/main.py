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
    print("[bold blue]API has started!")


@app.on_event("shutdown")
async def shutdown_event():
    print("[bold blue]API has been shutdown!")


# add all routers
for route in router_list:
    app.include_router(router=route)

# add all middleware
for middleware in middleware_list:
    app.add_middleware(middleware)

# connect to db through tortoise orm
register_tortoise(
    app,
    config=TORTOISE_CONFIG,
    generate_schemas=True,
    add_exception_handlers=True,
)

PORT: Final = 8443

# check weather startup api in dev mode or not
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
    }


if __name__ == "__main__":
    uvicorn.run(**options)
