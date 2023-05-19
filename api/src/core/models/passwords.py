from tortoise.models import Model
from tortoise.fields import (
    UUIDField,
    CharField,
    TextField,
    DatetimeField,
    ForeignKeyField,
)


class Password(Model):

    """
    A class to represent a Password record from the database
    """

    id = UUIDField(pk=True, auto_generate=True)
    name = CharField(32)
    username = CharField(64)
    password = TextField()
    salt = TextField()
    url = CharField(2048)
    note = CharField(2000, null=True)
    owner = ForeignKeyField("models.User", "password_users")
    date_added = DatetimeField(auto_now_add=True)
    last_edited = DatetimeField(auto_now=True)

    class Meta:
        table = "passwords"
