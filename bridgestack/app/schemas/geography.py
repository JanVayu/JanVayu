from pydantic import BaseModel


class StateBase(BaseModel):
    state_id: str
    state_name: str
    region: str | None = None
    state_type: str | None = None
    capital: str | None = None
    area_sq_km: float | None = None
    census_2011_pop: int | None = None

    model_config = {"from_attributes": True}


class DistrictBase(BaseModel):
    district_id: str
    district_name: str
    state_id: str
    tier: str | None = None
    census_2011_pop: int | None = None
    area_sq_km: float | None = None
    latitude: float | None = None
    longitude: float | None = None

    model_config = {"from_attributes": True}


class StateDetail(StateBase):
    districts: list[DistrictBase] = []
