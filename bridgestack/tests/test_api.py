import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.database import Base, get_db
from app.main import app

engine = create_engine(
    "sqlite:///./test.db", connect_args={"check_same_thread": False}
)
TestSession = sessionmaker(bind=engine)


def override_get_db():
    db = TestSession()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def test_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "BridgeStack API"
    assert "stacks" in data


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_list_states_empty():
    response = client.get("/api/v1/geography/states")
    assert response.status_code == 200
    assert response.json() == []


def test_list_sectors_empty():
    response = client.get("/api/v1/sectors/")
    assert response.status_code == 200
    assert response.json() == []


def test_list_indicators_empty():
    response = client.get("/api/v1/indicators/")
    assert response.status_code == 200
    assert response.json() == []


def test_list_schemes_empty():
    response = client.get("/api/v1/policies/schemes")
    assert response.status_code == 200
    assert response.json() == []


def test_list_tools_empty():
    response = client.get("/api/v1/tools/")
    assert response.status_code == 200
    assert response.json() == []


def test_state_not_found():
    response = client.get("/api/v1/geography/states/nonexistent")
    assert response.status_code == 404


def test_district_not_found():
    response = client.get("/api/v1/geography/districts/nonexistent")
    assert response.status_code == 404


def test_indicator_not_found():
    response = client.get("/api/v1/indicators/nonexistent")
    assert response.status_code == 404


def test_scheme_not_found():
    response = client.get("/api/v1/policies/schemes/nonexistent")
    assert response.status_code == 404


def test_tool_not_found():
    response = client.get("/api/v1/tools/999")
    assert response.status_code == 404


def test_docs_available():
    response = client.get("/docs")
    assert response.status_code == 200


def test_openapi_schema():
    response = client.get("/openapi.json")
    assert response.status_code == 200
    schema = response.json()
    assert schema["info"]["title"] == "BridgeStack API"
