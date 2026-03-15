from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "BridgeStack API"
    app_version: str = "0.2.0"
    app_description: str = "API backend bridging OpenStacks data layers"
    database_url: str = "sqlite:///./rootstack.db"
    debug: bool = False
    cors_origins: list[str] = ["*"]

    model_config = {"env_prefix": "BRIDGE_"}


settings = Settings()
