from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.sectors import Sector
from app.schemas.sectors import SectorBase

router = APIRouter(prefix="/sectors", tags=["Sectors"])


@router.get("/", response_model=list[SectorBase])
def list_sectors(db: Session = Depends(get_db)):
    return db.query(Sector).order_by(Sector.sector_name).all()


@router.get("/{sector_id}", response_model=SectorBase)
def get_sector(sector_id: str, db: Session = Depends(get_db)):
    sector = db.query(Sector).filter(Sector.sector_id == sector_id).first()
    if not sector:
        raise HTTPException(status_code=404, detail="Sector not found")
    return sector
