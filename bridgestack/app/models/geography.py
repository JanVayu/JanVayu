from sqlalchemy import Column, Float, ForeignKey, Integer, Text
from sqlalchemy.orm import relationship

from app.core.database import Base


class State(Base):
    __tablename__ = "states"

    state_id = Column(Text, primary_key=True)
    state_name = Column(Text, nullable=False)
    region = Column(Text)
    state_type = Column(Text)
    capital = Column(Text)
    area_sq_km = Column(Float)
    census_2011_pop = Column(Integer)

    districts = relationship("District", back_populates="state")


class District(Base):
    __tablename__ = "districts"

    district_id = Column(Text, primary_key=True)
    district_name = Column(Text, nullable=False)
    state_id = Column(Text, ForeignKey("states.state_id"))
    tier = Column(Text)
    census_2011_pop = Column(Integer)
    area_sq_km = Column(Float)
    latitude = Column(Float)
    longitude = Column(Float)

    state = relationship("State", back_populates="districts")
