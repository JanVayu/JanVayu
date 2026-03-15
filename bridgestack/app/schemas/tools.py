from pydantic import BaseModel


class ToolBase(BaseModel):
    id: int
    tool_name: str
    stack: str | None = None
    directory: str | None = None
    description: str | None = None
    sector: str | None = None
    language: str | None = None
    tool_type: str | None = None
    difficulty: str | None = None
    tags: str | None = None
    file_count: int | None = None

    model_config = {"from_attributes": True}
