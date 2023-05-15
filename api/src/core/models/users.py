from tortoise.models import Model
from tortoise.fields import UUIDField, CharField, TextField


class User(Model):
    """
    A class to represent a User record in the database
    """

    id = UUIDField(pk=True, auto_generate=True)
    username = CharField(32, unique=True)
    auth_key_hash = TextField()

    class Meta:
        table = "users"


# Things to store locally
# vault_key_salt
# auth_key_salt
# vault_key_cached (optional)
