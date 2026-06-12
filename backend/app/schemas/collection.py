from pydantic import BaseModel
from app.schemas.card import CardOut

class UserCardCreate(BaseModel):
    """Lo que envía el frontend para añadir una carta a la colección."""
    pokemontcg_id: str | None = None
    name: str
    set_name: str | None = None
    number: str | None = None
    rarity: str | None = None
    image_url: str | None = None

    quantity: int = 1
    condition: str = "near_mint"
    language: str = "en"
    is_foil: bool = False
    purchase_price: float | None = None
    notes: str | None = None

class UserCardOut(BaseModel):
    id: int
    quantity: int
    condition: str
    language: str
    is_foil: bool
    purchase_price: float | None
    notes: str | None
    card: CardOut
    
    # precio actual (calculado al vuelo, no se guarda en BD)
    current_price: dict | None = None
    estimated_value: float | None = None

    class Config:
        from_attributes = True

class CollectionSummary(BaseModel):
    total_cards: int
    total_value_eur: float
    by_rarity: dict[str, dict] # {"Rare": {"count": 12, "value": 85.5}, ...}
    items: list[UserCardOut]