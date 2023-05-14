from typing import Final

import os
from dotenv import load_dotenv

load_dotenv()

DB_PATH: Final = os.path.join(os.path.dirname(__file__), "db.sqlite3")
TORTOISE_CONFIG: Final = {
    "connections": {"default": f"sqlite://{DB_PATH}"},
    "apps": {
        "models": {
            "models": ["core.models.users"],
            "default_connection": "default",
        }
    },
    "use_tz": False,
    "timezone": "UTC",
}
