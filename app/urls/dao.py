from sqlalchemy import select
from app.dao.base import BaseDAO
from app.urls.models import URL
from app.urls import schemas, keygen

from sqlalchemy.ext.asyncio import AsyncSession


class UrlDAO(BaseDAO):
    model = URL

    @classmethod
    async def create_db_url(
        cls,
        db: AsyncSession,
        url: schemas.URLBase
    ) -> URL:
        key = await keygen.create_unique_random_key(db)
        secret_key = f"{key}_{keygen.create_random_key(length=8)}"
        db_url = URL(
            target_url=url.target_url,
            key=key,
            secret_key=secret_key,
            is_active=True
        )
        db.add(db_url)
        await db.commit()
        await db.refresh(db_url)

        return db_url

    @classmethod
    async def get_db_url_by_key(
        cls,
        db: AsyncSession,
        url_key: str
    ) -> URL:
        print(f"\nQuerying for url_key: {url_key}")
        print(f"\nQuerying for {URL.key}\n")
        result = await db.execute(
            select(URL).where(URL.key == url_key, URL.is_active)
        )
        db_url = result.scalar_one_or_none()

        return db_url

    @classmethod
    async def get_db_url_by_secret_key(
        cls,
        db: AsyncSession,
        secret_key: str
    ) -> URL:
        result = await db.execute(
            select(URL).where(URL.secret_key == secret_key, URL.is_active)
        )
        db_url = result.scalar_one_or_none()

        return db_url

    @classmethod
    async def update_db_clicks(
        cls,
        db: AsyncSession,
        db_url: schemas.URL
    ) -> URL:
        db_url.clicks += 1
        await db.commit()
        await db.refresh(db_url)

        return db_url

    @classmethod
    async def deactivate_db_url_by_secret_key(
        cls,
        db: AsyncSession,
        secret_key: str
    ) -> URL:
        db_url = await cls.get_db_url_by_secret_key(db, secret_key)
        print("\nTEXT\n", db_url)
        if db_url:
            db_url.is_active = False
            await db.commit()
            await db.refresh(db_url)

        return db_url
