from sqlalchemy import Column, Float, ForeignKey, Integer, Text
from sqlalchemy.orm import relationship

from app.core.database import Base


class Indicator(Base):
    __tablename__ = "indicators"

    indicator_id = Column(Text, primary_key=True)
    indicator_name = Column(Text, nullable=False)
    sector_id = Column(Text, ForeignKey("sectors.sector_id"))
    unit = Column(Text)
    direction = Column(Text)
    source = Column(Text)
    frequency = Column(Text)
    description = Column(Text)

    sector = relationship("Sector")
    values = relationship("IndicatorValue", back_populates="indicator")


class IndicatorValue(Base):
    __tablename__ = "indicator_values"

    id = Column(Integer, primary_key=True, autoincrement=True)
    indicator_id = Column(Text, ForeignKey("indicators.indicator_id"))
    state_id = Column(Text, ForeignKey("states.state_id"))
    district_id = Column(Text, ForeignKey("districts.district_id"), nullable=True)
    year = Column(Integer)
    value = Column(Float)

    indicator = relationship("Indicator", back_populates="values")
    state = relationship("State", foreign_keys=[state_id])
    district = relationship("District", foreign_keys=[district_id])
