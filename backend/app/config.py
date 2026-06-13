import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    GEMINI_API_KEY: str = os.environ.get("GEMINI_API_KEY", "")
    POKEMONTCG_API_KEY: str = os.environ.get("POKEMONTCG_API_KEY", "")
    DATABASE_URL: str = os.environ.get("DATABASE_URL", "sqlite:///./pokelens.db")


settings = Settings()