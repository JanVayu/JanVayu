from sqlalchemy import Column, Float, ForeignKey, Integer, Text
from sqlalchemy.orm import relationship

from app.core.database import Base


class Scheme(Base):
    __tablename__ = "schemes"

    scheme_id = Column(Text, primary_key=True)
    scheme_name = Column(Text, nullable=False)
    ministry = Column(Text)
    sector_id = Column(Text, ForeignKey("sectors.sector_id"))
    level = Column(Text)
    launch_year = Column(Integer)
    status = Column(Text)
    beneficiary_type = Column(Text)
    website = Column(Text)

    sector = relationship("Sector")
    budgets = relationship("SchemeBudget", back_populates="scheme")
    coverage = relationship("SchemeCoverage", back_populates="scheme")


class SchemeBudget(Base):
    __tablename__ = "scheme_budgets"

    id = Column(Integer, primary_key=True, autoincrement=True)
    scheme_id = Column(Text, ForeignKey("schemes.scheme_id"))
    fiscal_year = Column(Text)
    allocated_crores = Column(Float)
    revised_crores = Column(Float)
    spent_crores = Column(Float)

    scheme = relationship("Scheme", back_populates="budgets")


class SchemeCoverage(Base):
    __tablename__ = "scheme_coverage"

    id = Column(Integer, primary_key=True, autoincrement=True)
    scheme_id = Column(Text, ForeignKey("schemes.scheme_id"))
    state_id = Column(Text, ForeignKey("states.state_id"))
    district_id = Column(Text, ForeignKey("districts.district_id"), nullable=True)
    year = Column(Integer)
    beneficiaries = Column(Integer)
    target = Column(Integer)
    achievement_pct = Column(Float)

    scheme = relationship("Scheme", back_populates="coverage")
    state = relationship("State", foreign_keys=[state_id])
