from sqlalchemy import Column, Integer, Text

from app.core.database import Base


class Tool(Base):
    __tablename__ = "tools"

    id = Column(Integer, primary_key=True, autoincrement=True)
    tool_name = Column(Text, nullable=False)
    stack = Column(Text)
    directory = Column(Text)
    description = Column(Text)
    sector = Column(Text)
    language = Column(Text)
    tool_type = Column(Text)
    difficulty = Column(Text)
    tags = Column(Text)
    file_count = Column(Integer)
