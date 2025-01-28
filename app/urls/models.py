from typing import Optional

from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base

class URL(Base):
    __tablename__ = "urls"

    id: Mapped[int] = mapped_column(primary_key=True)
    key: Mapped[str] = mapped_column(unique=True, index=True)
    secret_key: Mapped[str] = mapped_column(unique=True, index=True)
    target_url: Mapped[str] = mapped_column(index=True)
    is_active: Mapped[bool] = mapped_column(default=True)
    clicks: Mapped[Optional[int]] = mapped_column(default=0)

    def __repr__(self):
        return f"URL <{self.id}> | target_url<{self.target_url}"
