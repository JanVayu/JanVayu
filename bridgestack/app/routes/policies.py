from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload

from app.core.database import get_db
from app.models.policies import Scheme, SchemeBudget, SchemeCoverage
from app.schemas.policies import (
    SchemeBase,
    SchemeBudgetBase,
    SchemeCoverageBase,
    SchemeDetail,
)

router = APIRouter(prefix="/policies", tags=["Policies"])


@router.get("/schemes", response_model=list[SchemeBase])
def list_schemes(
    sector_id: str | None = Query(None, description="Filter by sector"),
    status: str | None = Query(None, description="Filter by status"),
    level: str | None = Query(None, description="Filter by funding level"),
    db: Session = Depends(get_db),
):
    query = db.query(Scheme)
    if sector_id:
        query = query.filter(Scheme.sector_id == sector_id)
    if status:
        query = query.filter(Scheme.status == status)
    if level:
        query = query.filter(Scheme.level == level)
    return query.order_by(Scheme.scheme_name).all()


@router.get("/schemes/{scheme_id}", response_model=SchemeDetail)
def get_scheme(scheme_id: str, db: Session = Depends(get_db)):
    scheme = (
        db.query(Scheme)
        .options(joinedload(Scheme.budgets), joinedload(Scheme.coverage))
        .filter(Scheme.scheme_id == scheme_id)
        .first()
    )
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return scheme


@router.get("/budgets", response_model=list[SchemeBudgetBase])
def list_budgets(
    scheme_id: str | None = Query(None),
    fiscal_year: str | None = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(SchemeBudget)
    if scheme_id:
        query = query.filter(SchemeBudget.scheme_id == scheme_id)
    if fiscal_year:
        query = query.filter(SchemeBudget.fiscal_year == fiscal_year)
    return query.all()


@router.get("/coverage", response_model=list[SchemeCoverageBase])
def list_coverage(
    scheme_id: str | None = Query(None),
    state_id: str | None = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(SchemeCoverage)
    if scheme_id:
        query = query.filter(SchemeCoverage.scheme_id == scheme_id)
    if state_id:
        query = query.filter(SchemeCoverage.state_id == state_id)
    return query.all()
