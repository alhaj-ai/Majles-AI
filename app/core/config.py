from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./majles.db"

    SECRET_KEY: str = "majles-dev-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    MAIL_USERNAME: str = "noreply@majles.local"
    MAIL_PASSWORD: str = ""
    MAIL_FROM: str = "noreply@majles.local"

    MAIL_PORT: int = 587
    MAIL_SERVER: str = "localhost"
    MAIL_FROM_NAME: str = "Majles-AI"

    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False

    WHISPER_MODEL_PATH: str = "openai/whisper-large-v3"
    HF_TOKEN: str = ""

    LLM_MODEL_NAME: str = "qwen2.5:3b"
    LLM_MODEL_URL: str = "http://localhost:11434/api/generate"

    GEMINI_API_KEY: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
