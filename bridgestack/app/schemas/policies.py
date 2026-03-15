from pydantic import BaseModel


class SchemeBase(BaseModel):
    scheme_id: str
    scheme_name: str
    ministry: str | None = None
    sector_id: str | None = None
    level: str | None = None
    launch_year: int | None = None
    status: str | None = None
    beneficiary_type: str | None = None
    website: str | None = None

    model_config = {"from_attributes": True}


class SchemeBudgetBase(BaseModel):
    scheme_id: str
    fiscal_year: str | None = None
    allocated_crores: float | None = None
    revised_crores: float | None = None
    spent_crores: float | None = None

    model_config = {"from_attributes": True}


class SchemeCoverageBase(BaseModel):
    scheme_id: str
    state_id: str
    district_id: str | None = None
    year: int | None = None
    beneficiaries: int | None = None
    target: int | None = None
    achievement_pct: float | None = None

    model_config = {"from_attributes": True}


class SchemeDetail(SchemeBase):
    budgets: list[SchemeBudgetBase] = []
    coverage: list[SchemeCoverageBase] = []
