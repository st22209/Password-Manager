import re

from tortoise.models import Model
from pydantic import BaseModel, validator
from tortoise.fields import UUIDField, CharField, TextField

from core.helpers import APIHTTPExceptions, argon2_hash, argon2_verify


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
    auth_key: str

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

    async def hashpass(self):
        self.auth_key = await argon2_hash(self.auth_key)


class AuthModification(BaseModel):
    user_id: str
    auth_key: str

    async def hashpass(self):
        self.auth_key = await argon2_hash(self.auth_key)


async def verify_auth_key(owner_id: str, auth_key: str) -> None:
    if (user := await User.get(id=owner_id)) is None:
        raise APIHTTPExceptions.USER_NOT_FOUND(owner_id)

    if not await argon2_verify(auth_key, user.auth_key_hash):
        raise APIHTTPExceptions.INVALID_AUTH_KEY(auth_key)


# Things to store locally
# vault_key_salt
# auth_key_salt
# vault_key_cached (optional)
