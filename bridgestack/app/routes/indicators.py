from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload

from app.core.database import get_db
from app.models.indicators import Indicator, IndicatorValue
from app.schemas.indicators import IndicatorBase, IndicatorDetail, IndicatorValueBase

router = APIRouter(prefix="/indicators", tags=["Indicators"])


@router.get("/", response_model=list[IndicatorBase])
def list_indicators(
    sector_id: str | None = Query(None, description="Filter by sector"),
    source: str | None = Query(None, description="Filter by data source"),
    db: Session = Depends(get_db),
):
    query = db.query(Indicator)
    if sector_id:
        query = query.filter(Indicator.sector_id == sector_id)
    if source:
        query = query.filter(Indicator.source.ilike(f"%{source}%"))
    return query.order_by(Indicator.indicator_name).all()


@router.get("/{indicator_id}", response_model=IndicatorDetail)
def get_indicator(indicator_id: str, db: Session = Depends(get_db)):
    indicator = (
        db.query(Indicator)
        .options(joinedload(Indicator.values))
        .filter(Indicator.indicator_id == indicator_id)
        .first()
    )
    if not indicator:
        raise HTTPException(status_code=404, detail="Indicator not found")
    return indicator


@router.get("/values/", response_model=list[IndicatorValueBase])
def list_indicator_values(
    indicator_id: str | None = Query(None),
    state_id: str | None = Query(None),
    year: int | None = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(IndicatorValue)
    if indicator_id:
        query = query.filter(IndicatorValue.indicator_id == indicator_id)
    if state_id:
        query = query.filter(IndicatorValue.state_id == state_id)
    if year:
        query = query.filter(IndicatorValue.year == year)
    return query.all()
