""" (module)
functions for hashing and verifing hashes with argon2
"""

from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, VerificationError, InvalidHash


async def argon2_hash(text: str) -> str:
    """
    Hashes text using the argon2 algorithm

    Parameters:
        text (str): The text to hash

    Returns:
        str: The hashed output of the function
    """

    password_hasher = PasswordHasher()
    hashed_output = password_hasher.hash(text)

    return hashed_output


async def argon2_verify(password: str, hashed: str) -> bool:
    """
    Verifies an unverified password against the hashed version using bcrypt

    Parameters:
        password (str): The password in plain text
        hashed (str): The hashed password (from database)

    Returns:
        bool: If the hash is verified it returns true
    """

    password_hasher = PasswordHasher()
    try:
        password_hasher.verify(hashed, password)
    except (VerifyMismatchError, VerificationError, InvalidHash):
        return False

    return True
