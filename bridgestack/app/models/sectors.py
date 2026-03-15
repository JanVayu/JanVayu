from sqlalchemy import Column, ForeignKey, Text
from sqlalchemy.orm import relationship

from app.core.database import Base


class Sector(Base):
    __tablename__ = "sectors"

    sector_id = Column(Text, primary_key=True)
    sector_name = Column(Text, nullable=False)
    parent_id = Column(Text, ForeignKey("sectors.sector_id"))

    parent = relationship("Sector", remote_side=[sector_id], backref="children")
