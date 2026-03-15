from pydantic import BaseModel


class IndicatorBase(BaseModel):
    indicator_id: str
    indicator_name: str
    sector_id: str | None = None
    unit: str | None = None
    direction: str | None = None
    source: str | None = None
    frequency: str | None = None
    description: str | None = None

    model_config = {"from_attributes": True}


class IndicatorValueBase(BaseModel):
    indicator_id: str
    state_id: str
    district_id: str | None = None
    year: int | None = None
    value: float | None = None

    model_config = {"from_attributes": True}


class IndicatorDetail(IndicatorBase):
    values: list[IndicatorValueBase] = []
