from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload

from app.core.database import get_db
from app.models.geography import District, State
from app.schemas.geography import DistrictBase, StateBase, StateDetail

router = APIRouter(prefix="/geography", tags=["Geography"])


@router.get("/states", response_model=list[StateBase])
def list_states(
    region: str | None = Query(None, description="Filter by region"),
    db: Session = Depends(get_db),
):
    query = db.query(State)
    if region:
        query = query.filter(State.region == region)
    return query.order_by(State.state_name).all()


@router.get("/states/{state_id}", response_model=StateDetail)
def get_state(state_id: str, db: Session = Depends(get_db)):
    state = (
        db.query(State)
        .options(joinedload(State.districts))
        .filter(State.state_id == state_id)
        .first()
    )
    if not state:
        raise HTTPException(status_code=404, detail="State not found")
    return state


@router.get("/districts", response_model=list[DistrictBase])
def list_districts(
    state_id: str | None = Query(None, description="Filter by state"),
    tier: str | None = Query(None, description="Filter by tier"),
    db: Session = Depends(get_db),
):
    query = db.query(District)
    if state_id:
        query = query.filter(District.state_id == state_id)
    if tier:
        query = query.filter(District.tier == tier)
    return query.order_by(District.district_name).all()


@router.get("/districts/{district_id}", response_model=DistrictBase)
def get_district(district_id: str, db: Session = Depends(get_db)):
    district = db.query(District).filter(District.district_id == district_id).first()
    if not district:
        raise HTTPException(status_code=404, detail="District not found")
    return district
