import re

import pytest


def validation_function(username: str) -> bool:
    """
    This function is properly implemented in src/core/users.NewUser
    """

    if not username:
        return False
    if username[0].isnumeric():
        return False
    if not re.match(
        "^(?=.{3,32}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$", username
    ):
        return False

    return True


INVALID_USERNAMES = [
    None,
    "",
    "e",
    "1NumberNah",
    "ThisPasswordIsTooLongToPassTheChecksItShouldBeFalse",
    "NeverGonnagiveYouUpNeverGonnaLetYouDown",
    "_FusionSid",
    "FusionSid_",
    ".FusionSid",
    "FusionSid.",
    "Hey__",
    "__Hey",
    "Hello._There",
    "Hello_.There",
    "Hello..There",
    "Hello__There",
    "%^&*()(*Y&UGFHVJB??::>)",
]
VALID_USERNAMES = ["FusionSid", "Rick", "Sid123", "This.Password", "hello_There"]
TEST_CASES = [(i, False) for i in INVALID_USERNAMES] + [
    (i, True) for i in VALID_USERNAMES
]


@pytest.mark.parametrize("username, expected", TEST_CASES)
def test_function(username: str, expected: bool):
    assert validation_function(username) == expected
