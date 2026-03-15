from __future__ import annotations

from pydantic import BaseModel


class SectorBase(BaseModel):
    sector_id: str
    sector_name: str
    parent_id: str | None = None

    model_config = {"from_attributes": True}


class SectorTree(SectorBase):
    children: list[SectorTree] = []
