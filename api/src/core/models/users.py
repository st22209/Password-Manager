from tortoise.models import Model


class User(Model):
    """
    the user
    """

    class Meta:
        table = "users"
