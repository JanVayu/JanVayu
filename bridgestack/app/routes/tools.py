from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.tools import Tool
from app.schemas.tools import ToolBase

router = APIRouter(prefix="/tools", tags=["Tools"])


@router.get("/", response_model=list[ToolBase])
def list_tools(
    stack: str | None = Query(None, description="Filter by stack"),
    language: str | None = Query(None, description="Filter by language"),
    tool_type: str | None = Query(None, description="Filter by type"),
    difficulty: str | None = Query(None, description="Filter by difficulty"),
    db: Session = Depends(get_db),
):
    query = db.query(Tool)
    if stack:
        query = query.filter(Tool.stack == stack)
    if language:
        query = query.filter(Tool.language == language)
    if tool_type:
        query = query.filter(Tool.tool_type == tool_type)
    if difficulty:
        query = query.filter(Tool.difficulty == difficulty)
    return query.order_by(Tool.tool_name).all()


@router.get("/{tool_id}", response_model=ToolBase)
def get_tool(tool_id: int, db: Session = Depends(get_db)):
    tool = db.query(Tool).filter(Tool.id == tool_id).first()
    if not tool:
        raise HTTPException(status_code=404, detail="Tool not found")
    return tool
