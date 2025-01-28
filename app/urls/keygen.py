import secrets
import string
from functools import lru_cache

from sqlalchemy.ext.asyncio import AsyncSession


def create_random_key(length: int = 5) -> str:
    print("Initialise secret key ⏳⌛️")
    chars = string.ascii_uppercase + string.digits
    return "".join(secrets.choice(chars) for _ in range(length))


async def create_unique_random_key(db: AsyncSession) -> str:
    from .dao import UrlDAO  # Import inside the function
    key = create_random_key()
    while await UrlDAO.get_db_url_by_key(db, key):
        key = create_random_key()
    return key