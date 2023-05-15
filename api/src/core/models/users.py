import re

from tortoise.models import Model
from pydantic import BaseModel, validator
from tortoise.fields import UUIDField, CharField, TextField

from core.helpers import APIHTTPExceptions


class User(Model):
    """
    A class to represent a User record in the database
    """

    id = UUIDField(pk=True, auto_generate=True)
    username = CharField(32, unique=True)
    auth_key_hash = TextField()

    class Meta:
        table = "users"


class NewUser(BaseModel):
    username: str
    auth_key_hash: str

    @validator("username")
    @classmethod
    def validate_user_name(cls, username: str):
        """
        Takes in an username and checks if it is valid

        Parameters:
            username (str): The username of the person signing up

        Returns:
            str: If username is valid it returns the user

        Raises:
            InvalidUsernameError: If the username is invalid it raises an exception
        """

        if not username:
            raise APIHTTPExceptions.INVALID_USERNAME_ERROR(username)
        if username[0].isnumeric():
            raise APIHTTPExceptions.INVALID_USERNAME_ERROR(username)
        if not re.match(
            "^(?=.{3,32}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$", username
        ):
            raise APIHTTPExceptions.INVALID_USERNAME_ERROR(username)

        return username


# Things to store locally
# vault_key_salt
# auth_key_salt
# vault_key_cached (optional)
