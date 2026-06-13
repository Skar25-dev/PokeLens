from pydantic import BaseModel, ConfigDict

class CardResult(BaseModel):
    """Resultado devuelto por /scan (identificación + precio, sin guardar)."""
    name: str
    set_name: str | None = None
    number: str | None = None
    rarity: str | None = None
    image_url: str | None = None
    pokemontcg_id: str | None = None
    prices: dict | None = None

class CardOut(BaseModel):
    """Carta tal como está guardada en BD."""
    id: int
    pokemontcg_id: str | None = None
    name: str
    set_name: str | None = None
    number: str | None = None
    rarity: str | None = None
    image_url: str | None = None

    model_config = ConfigDict(from_attributes=True)