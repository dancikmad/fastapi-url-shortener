import validators
from fastapi import Depends, FastAPI, Request
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from app.exceptions import BadRequestException, NotFoundException

from .database import get_db_session, sessionmanager, Base
from starlette.datastructures import URL
from .config import get_settings

from .urls.dao import UrlDAO
from app.urls import schemas


app = FastAPI()


# Allow all origins (you can restrict this to specific domains later)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins, adjust for production
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods like GET, POST, etc.
    allow_headers=["*"],  # Allow all headers
)


def get_admin_info(db_url: URL) -> schemas.URLInfo:
    base_url = URL(get_settings().base_url)
    admin_endpoint = app.url_path_for(
        "administration info", secret_key=db_url.secret_key
    )
    db_url.url = str(base_url.replace(path=db_url.key))
    db_url.admin = str(base_url.replace(path=admin_endpoint))

    return db_url


@app.on_event("startup")
async def init_tables():
    async with sessionmanager.connect() as conn:
        # await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)


@app.get("/")
def read_root():
    return "Welcome to the URL shortener API :)"


@app.get("/{url_key}")
async def forward_to_target_url(
    url_key: str, request: Request, db: AsyncSession = Depends(get_db_session)
):
    if db_url := await UrlDAO.get_db_url_by_key(db=db, url_key=url_key):
        await UrlDAO.update_db_clicks(db=db, db_url=db_url)
        return RedirectResponse(db_url.target_url)
    else:
        raise NotFoundException(request)


@app.get("/admin/{secret_key}", name="administration info")
async def get_url_info(
    secret_key: str, request: Request, db: AsyncSession = Depends(get_db_session)
) -> schemas.URLInfo:
    if db_url := await UrlDAO.get_db_url_by_secret_key(db, secret_key=secret_key):
        return get_admin_info(db_url)
    else:
        raise NotFoundException(request)


@app.post("/url")
async def create_url(
    url: schemas.URLBase, db: AsyncSession = Depends(get_db_session)
) -> schemas.URLInfo:
    if not validators.url(url.target_url):
        BadRequestException()

    db_url = await UrlDAO.create_db_url(db=db, url=url)
    return get_admin_info(db_url)


@app.delete("/admin/{secret_key}")
async def delete_url(
    secret_key: str, request: Request, db: AsyncSession = Depends(get_db_session)
):
    if db_url := await UrlDAO.deactivate_db_url_by_secret_key(
        db, secret_key=secret_key
    ):
        message = f"Successfully deleted shortened URL for {db_url.target_url}"
        return {"detail": message}
    else:
        raise NotFoundException(request)
