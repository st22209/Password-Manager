from tortoise.models import Model
from tortoise.fields import UUIDField, CharField, TextField, DatetimeField


class Password(Model):

    """
    A class to represent a Password record from the database
    """

    id = UUIDField(pk=True, auto_generate=True)
    name = CharField(32)
    username = CharField(64)
    password = TextField()
    salt = TextField()
    url = CharField(256)
    note = CharField(2000)
    date_added = DatetimeField(auto_now_add=True)
    last_edited = DatetimeField(auto_now=True)

    class Meta:
        table = "passwords"
